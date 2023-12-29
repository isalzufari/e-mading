const pool = require('./SqlService');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const Base64ToImg = require('../utils/base64Image');

class ArticlesService {
  constructor() {
    this._pool = pool.promise();
  }

  async getArticles() {
    const query = {
      text: `SELECT title, slug, description, image FROM articles`,
    }

    const [result, fields] = await this._pool.query(
      query.text,
    );

    return result;
  }

  async getArticleBySlug({ slug }) {
    const query = {
      text: 'SELECT title, slug, description, image FROM `articles` WHERE `slug` = ?',
      values: [slug],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new NotFoundError('Article tidak tersedia');
    }

    return result[0];
  }

  async addArticle({ id_user, title, description, image }) {
    const filename = await Base64ToImg(image);
    const locationImg = `images/${filename}`;
    const slug = await this.convertToSlug(title);

    const query = {
      text: 'INSERT INTO articles (title, slug, description, `image`, isDraft) VALUES(?, ?, ?, ?, ?)',
      values: [title, slug, description, locationImg, 1]
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.insertId) {
      throw new InvariantError('Spot gagal ditambahkan: addSpot');
    }

    const idArticle = result.insertId;

    // User Have Article 
    this.addUserHaveArticle(id_user, idArticle);
  }

  async convertToSlug(name) {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  async addUserHaveArticle(id_user, idArticle) {
    const query = {
      text: 'INSERT INTO article (id_user, id_article) VALUES(?, ?)',
      values: [id_user, idArticle]
    };

    await this._pool.query(
      query.text,
      query.values,
    );
  }
}

module.exports = ArticlesService;
