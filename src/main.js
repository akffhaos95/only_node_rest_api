// @ts-check

/**
 * 블로그 포스팅 서비스
 * - 로컬 파일을 데이터베이스로 활용할 예정
 * - 인증 로직은 넣지 않는다
 * - RESTful API를 사용
 */

const http = require('http');

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
 * GET /posts
 * GET /posts/:id
 * POST /posts
 */
const server = http.createServer((req, res) => {
  const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/;
  const postIdRegexResult =
    (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined;

  if (req.url === '/posts' && req.method === 'GET') {
    const result = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
      })),
      totalCount: posts.length,
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; encoding=utf-8');
    res.end(JSON.stringify(result));
  } else if (postIdRegexResult && req.method === 'GET') {
    const postId = postIdRegexResult[1];
    const post = posts.find((_post) => _post.id === postId);
    if (post) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; encoding=utf-8');
      res.end(JSON.stringify(post));
    } else {
      res.statusCode = 404;
      res.end('no content');
    }
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.setEncoding('utf-8');
    req.on('data', (data) => {
      /**
       * @typedef CreatePostBody
       * @property {string} title
       * @property {string} content
       */

      /** @type {CreatePostBody} */
      const body = JSON.parse(data);
      posts.push({
        id: body.title.toLowerCase().replace(/\s/g, '_'),
        title: body.title,
        content: body.content,
      });
    });
    res.statusCode = 200;

    res.end('hello');
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`);
});
