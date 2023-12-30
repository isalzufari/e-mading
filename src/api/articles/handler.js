class ArticlesHandler {
  constructor(service) {
    this._service = service;

    this.postArticleHandler = this.postArticleHandler.bind(this);
    this.putArticleDraftHandler = this.putArticleDraftHandler.bind(this);
    this.getArticlesHandler = this.getArticlesHandler.bind(this);
    this.getArticleByIdHandler = this.getArticleByIdHandler.bind(this);
    this.getArticleBySlugHandler = this.getArticleBySlugHandler.bind(this);
  }

  async getArticlesHandler(request, h) {
    const articles = await this._service.getArticles();

    const mappedArticles = articles.map((article) => ({
      ...article,
      image: `http://${request.headers.host}/${article.image}`
    }));

    return h.response({
      status: 'success',
      data: mappedArticles,
    }).code(200);
  }

  async getArticleBySlugHandler(request, h) {
    const { slug } = request.params;

    const article = await this._service.getArticleBySlug({ slug });

    const mappedArticle = {
      ...article,
      image: `http://${request.headers.host}/${article.image}`
    }

    const response = h.response({
      status: 'success',
      data: mappedArticle,
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

  async putArticleDraftHandler(request, h) {
    const { id: id_user } = request.auth.credentials;
    const { id: idArticle } = request.params;
    const { isDraft } = request.payload;

    const data = await this._service.updateisDraft({ isDraft, id_user, idArticle });

    return h.response({
      status: 'success',
      message: 'Artikel berhasil diubah',
      data
    }).code(200);
  }

  async getArticleByIdHandler(request, h) {
    const { id: id_user } = request.auth.credentials;

    const articles = await this._service.getArticlesById({ id_user });

    const mappedArticles = articles.map((article) => ({
      ...article,
      image: `http://${request.headers.host}/${article.image}`
    }));

    return h.response({
      status: 'success',
      data: mappedArticles
    }).code(200);
  }
}

module.exports = ArticlesHandler;