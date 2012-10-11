var util = hexo.util,
  file = util.file,
  extend = hexo.extend,
  xml = require('jstoxml');

extend.generator.register(function(locals, render, callback){
 var publicDir = hexo.public_dir,
    config = hexo.config;

  var content = [
    {title: '<![CDATA[' + config.title + ']]>'},
    {
      _name: 'link',
      _attrs: {
        href: config.url + '/atom.xml',
        rel: 'self'
      }
    },
    {
      _name: 'link',
      _attrs: {
        href: config.url
      }
    },
    {updated: new Date().toISOString()},
    {author: 
      {
        name: '<![CDATA[' + config.author + ']]>'
      }
    },
    {
      _name: 'generator',
      _attrs: {
        uri: 'http://zespia.tw/hexo'
      },
      _content: 'Hexo'
    }
  ];

  if (config.email) content[4].author.email = '<![CDATA[' + config.email + ']]>';
  if (config.subtitle) content.splice(1, 0, {subtitle: '<![CDATA[' + config.subtitle + ']]>'});

  locals.posts.limit(20).each(function(item){
    var entry = [
      {
        _name: 'title',
        _attrs: {
          type: 'html'
        },
        _content: '<![CDATA[' + item.title + ']]>'
      },
      {
        _name: 'link',
        _attrs: {
          href: config.url + '/' + item.permalink
        }
      },
      {published: item.date.toDate().toISOString()},
      {updated: item.updated.toDate().toISOString()},
      {
        _name: 'content',
        _attrs: {
          type: 'html'
        },
        _content: '<![CDATA[' + item.content + ']]>'
      },
    ];

    content.push({entry: entry});
  });

  var result = xml.toXML({
    _name: 'feed',
    _attrs: {
      xmlns: 'http://www.w3.org/2005/Atom'
    },
    _content: content
  }, {header: true, indent: '  '});

  file.write(publicDir + 'atom.xml', result, callback);
});