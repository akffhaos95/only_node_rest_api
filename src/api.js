// @ts-check

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */
const posts = [
  {
    id: 'id1',
    title: '내 첫번째',
    content: 'content1',
  },
  {
    id: 'id2',
    title: 'title2',
    content: 'content2',
  },
];

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {string | Object} body
 */

/**
 * @typedef Route
 * @property {RegExp} url
 * @property {'GET' | 'POST'} method
 * @property {(matches: string[], body: Object.<string, *>|undefined) =>  Promise<APIResponse>} callback
 */

/** @type {Route[]} */
const routes = [
  {
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      statusCode: 200,
      body: posts,
    }),
  },
  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/,
    method: 'GET',
    callback: async (matches) => {
      const postId = matches[1];
      if (!postId) {
        return {
          statusCode: 404,
          body: 'Not found',
        };
      }
      const post = posts.find((_post) => _post.id === postId);
      if (!post) {
        return {
          statusCode: 404,
          body: 'Not found',
        };
      }
      return {
        statusCode: 200,
        body: post,
      };
    },
  },
  {
    url: /^\/posts/,
    method: 'POST',
    callback: async (_, body) => {
      if (!body) {
        return {
          statusCode: 400,
          body: 'Ill-formed request.',
        };
      }

      /** @type {string} */
      /* eslint-disable-next-line prefer-destructuring */
      const title = body.title;

      const newPost = {
        id: title.replace(/\s/g, '_'),
        title: body.title,
        content: body.content,
      };

      posts.push(newPost);

      return {
        statusCode: 200,
        body: newPost,
      };
    },
  },
];

module.exports = {
  routes,
};
