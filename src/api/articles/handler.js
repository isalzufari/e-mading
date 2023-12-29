class ArticlesHandler {
  constructor(service) {
    this._service = service;

    this.postArticleHandler = this.postArticleHandler.bind(this);
    this.getArticlesHandler = this.getArticlesHandler.bind(this);
    this.getArticleBySlugHandler = this.getArticleBySlugHandler.bind(this);
  }

  async getArticlesHandler(request, h) {
    const articles = await this._service.getArticles();

    return h.response({
      status: 'success',
      data: articles,
    }).code(200);
  }

  async getArticleBySlugHandler(request, h) {
    const { slug } = request.params;

    const article = await this._service.getArticleBySlug({ slug });

    const response = h.response({
      status: 'success',
      data: article,
    });
    response.code(200);
    return response;
  }

  async postArticleHandler(request, h) {
    const { id: id_user } = request.auth.credentials;
    const { title, description, image } = request.payload;

    await this._service.addArticle({ id_user, title, description, image });

    const response = h.response({
      status: 'success',
      message: 'Artikel berhasil ditambahkan'
    });
    response.code(201);
    return response;
  }
}

module.exports = ArticlesHandler;