# hexo-generator-sitemap

[![Build Status](https://travis-ci.org/hexojs/hexo-generator-sitemap.svg?branch=master)](https://travis-ci.org/hexojs/hexo-generator-sitemap)  [![NPM version](https://badge.fury.io/js/hexo-generator-sitemap.svg)](http://badge.fury.io/js/hexo-generator-sitemap) [![Coverage Status](https://img.shields.io/coveralls/hexojs/hexo-generator-sitemap.svg)](https://coveralls.io/r/hexojs/hexo-generator-sitemap?branch=master)

Generate sitemap.

## Install

``` bash
$ npm install hexo-generator-sitemap --save
```

- Hexo 3: 1.x
- Hexo 2: 0.x

## Options

You can configure this plugin in `_config.yml`.

``` yaml
sitemap:
    path: sitemap.xml
    priorities:
      "downloads/*": "1.0"
      "docs/.*|tutorials/.*|roadmap/.*|pro/.*": "0.9"
```

- **path** - Sitemap path. (Default: sitemap.xml)
- **priorities** - Sitemap prirorty.
  - key: the REGEX pattern urls matched.
  - value: the priority number.