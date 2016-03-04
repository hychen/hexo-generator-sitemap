'use strict';

var should = require('chai').should(); // eslint-disable-line
var Hexo = require('hexo');
var cheerio = require('cheerio');

describe('Sitemap generator', function() {
  var hexo = new Hexo(__dirname, {silent: true});
  var Post = hexo.model('Post');
  var generator = require('../lib/generator').bind(hexo);
  var sitemapTmpl = require('../lib/template')();
  var util = require('../lib/util');
  var posts;
  var locals;

  before(function() {
    return hexo.init().then(function() {
      return Post.insert([
        {source: 'foo', slug: 'foo', updated: 1e8},
        {source: 'bar', slug: 'bar', updated: 1e8 + 1},
        {source: 'baz', slug: 'baz', updated: 1e8 - 1}
      ]).then(function(data) {
        posts = Post.sort('-updated');
        locals = hexo.locals.toObject();
      });
    });
  });

  it('default', function() {
    hexo.config.sitemap = {
      path: 'sitemap.xml'
    };
    var postsArray = posts.toArray();
    var result = generator(locals);
    var alts = util.groupByAlternatives(postsArray);

    result.path.should.eql('sitemap.xml');
    result.data.should.eql(sitemapTmpl.render({
      config: hexo.config,
      posts: postsArray,
      alts: alts
    }));

    var $ = cheerio.load(result.data);

    $('urlset').find('url').each(function(i) {
      $(this).children('loc').text().should.eql(posts.eq(i).permalink);
      $(this).children('lastmod').text().should.eql(posts.eq(i).updated.toISOString());
    });
  });

  describe('with_priroties', function() {
    it('matchs', function() {
      hexo.config.sitemap.priorities = {
        'bar.*': "1.0",
        'foo': "0.8"
      };
      var result = generator(locals);

      var $ = cheerio.load(result.data);
      $('urlset').find('url').each(function(i) {
        var priority;
        var loc = $(this).children('loc').text();
        if (loc.match('bar.*')) {
          priority = '1.0';
        }
        else if (loc.match('foo')) {
          priority = '0.8';
        }
        else {
          priority = '0.1';
        }
        $(this).children('priority').text().should.eql(priority);
      });
    });
  });

  describe('skip_render', function() {
    it('array', function() {
      hexo.config.skip_render = ['foo'];

      var result = generator(locals);
      result.data.should.not.contain('foo');
    });

    it('string', function() {
      hexo.config.skip_render = 'bar';

      var result = generator(locals);
      result.data.should.not.contain('bar');
    });

    it('off', function() {
      hexo.config.skip_render = null;

      var result = generator(locals);
      result.should.be.ok;
    });
  });

});
