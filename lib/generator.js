'use strict';

var minimatch = require('minimatch');
var template = require('./template');
var util = require('./util');

module.exports = function(locals) {
  var config = this.config;
  var skipRenderList = [];
  var alts = {};
  var defaultLang = this.config.permalink_defaults.lang || 'en';
  var supportedLangs = Object.keys(locals.data.languages || {}) || [defaultLang];
  var homepages = util.buildHomePages(config.url, locals.data.languages);

  if (Array.isArray(config.skip_render)) {
    skipRenderList = config.skip_render;
  } else if (config.skip_render != null) {
    skipRenderList.push(config.skip_render);
  }

  var posts = homepages.concat(locals.posts.toArray(), locals.pages.toArray())
    .filter(function(post) {
      return post.sitemap !== false && !isMatch(post.source, skipRenderList);
    })
    .map(function(post) {
      var mlang = post.path.split('/')[0];
      post.lang = supportedLangs.indexOf(mlang) >= 0 ? mlang : defaultLang;
      return post;
    })
    .sort(function(a, b) {
      return b.updated - a.updated;
    });

  var xml = template().render({
    config: config,
    posts: posts,
    alts: util.groupByAlternatives(posts),
    priorities: util.buildPriorities(config.sitemap.priorities, posts)
  });

  return {
    path: config.sitemap.path,
    data: xml
  };
};

function isMatch(path, patterns) {
  if (!patterns) return false;
  if (!Array.isArray(patterns)) patterns = [patterns];
  if (!patterns.length) return false;

  for (var i = 0, len = patterns.length; i < len; i++) {
    if (minimatch(path, patterns[i])) return true;
  }

  return false;
}
