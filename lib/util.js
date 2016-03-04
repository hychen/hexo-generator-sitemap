/** Takes posts and groups by its alternative version.
 *
 * @param {Array<Post>} posts
 * @returns {Object}
 */
function groupByAlternatives(posts) {
  var alts = {};
  for(var i = 0; i < posts.length; i++) {
    var thisPost = posts[i];
    alts[thisPost.path] = posts.filter(function(post) {
      post.lang = 'en';
      return thisPost.path.indexOf(post.path) >= 0 ||
        post.path.indexOf(thisPost.path) >= 0;
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

module.exports = {
  groupByAlternatives: groupByAlternatives,
  buildPriorities: buildPriorities
};
