/** Build home page info.
 */
function buildHomePages(url, languages) {
  return languages.map(function(lang) {
    var path = 'index.html';
    if (lang !== 'en') {
      path = lang + '/' + path;
    }
    return {
      path: path,
      lang: lang,
      permalink: url + '/' + path,
      isHome: true
    };
  });
}

/** Takes posts and groups by its alternative version.
 *
 * @param {Array<Post>} posts
 * @returns {Object}
 */
function groupByAlternatives(supportedLangs, posts) {
  var alts = {};
  for(var i = 0; i < posts.length; i++) {
    var thisPost = posts[i];
    alts[thisPost.path] = posts.filter(function(post) {
      return isAlternative(supportedLangs, thisPost, post);
    });
  }
  return alts;
}

/** Build priroties map.
 *
 * @param {Object} defs
 * @param {Array{Post}} posts
 * @returns {Object} 
 */
function buildPriorities(defs, posts) {
  if (!defs) return {};

  var priorities = {};
  for(var i = 0; i < posts.length; i++) {
    var post = posts[i];
    for(var pattern in defs) {
      var priority = '0.1';
      if (post.path.match(pattern)) {
        priority = defs[pattern];
        break;
      }
    }
    priorities[post.path] = priority;
  }
  return priorities;
}

function isAlternative(supportedLangs, post1, post2) {
  function stripLang(path) {
    var pathSlices = path.split('/');
    var maybeLang = pathSlices[0];
    if (supportedLangs.indexOf(maybeLang) >= 0) {
      return pathSlices.slice(1, pathSlices.length).join('/');
    }
    else {
      return path;
    }
  }
  var realPath1 = stripLang(post1.path);
  var realPath2 = stripLang(post2.path);
  return realPath1 === realPath2;
}

module.exports = {
  groupByAlternatives: groupByAlternatives,
  buildPriorities: buildPriorities,
  buildHomePages: buildHomePages,
  isAlternative: isAlternative
};
