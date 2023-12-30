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
  {
    method: 'PUT',
    path: '/{id}/draft',
    handler: handler.putArticleDraftHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'GET',
    path: '/admin',
    handler: handler.getArticleByIdHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
]

module.exports = routes;
