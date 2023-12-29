const routes = (handler) => [
  {
    method: 'GET',
    path: '/',
    handler: handler.getArticlesHandler,
  },
  {
    method: 'GET',
    path: '/{slug}',
    handler: handler.getArticleBySlugHandler,
  },
  {
    method: 'POST',
    path: '/',
    handler: handler.postArticleHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
]

module.exports = routes;
