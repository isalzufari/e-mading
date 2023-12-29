const pool = require('./SqlService');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = pool.promise();
  }

  async getUserById({ id }) {
    const query = {
      text: 'SELECT name, email FROM `users` WHERE `id` = ?',
      values: [id],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    return result;
  }

  async addUser({ name, email, password }) {
    await this.verifyNewEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users (name, email, password, isAdmin) VALUES(?, ?, ?, ?)',
      values: [name, email, hashedPassword, 1],
    };

    try {
      const [result, fields] = await this._pool.query(
        query.text,
        query.values,
      );

      if (!result.insertId) {
        throw new InvariantError('User gagal ditambahkan: addUser');
      }

      return result.insertId;
    } catch (error) {
      console.log(error)
    }
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM `users` WHERE `email` = ?',
      values: [email],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (result.length > 0) {
      throw new InvariantError('User gagal ditambahkan: verifyNewEmail');
    }
  }

  async verifyUserCredential({ email, password }) {
    const query = {
      text: 'SELECT id, password FROM `users` WHERE email = ?',
      values: [email],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah atau sudah di deleted');
    }

    const { id, password: hashedPassword } = result[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang anda berikan salah tidak match');
    }

    return id;
  }
}

module.exports = UsersService;
