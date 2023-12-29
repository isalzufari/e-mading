require('dotenv').config();

const Hapi = require('@hapi/hapi');

// JWT
const Jwt = require('@hapi/jwt');

// Static Files
const Path = require('path');
const Inert = require('@hapi/inert');

const ClientError = require('./exceptions/ClientError');

const users = require('./api/users');
const UsersService = require('./services/UsersService');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/AuthenticationsService');
const TokenManager = require('./utils/TokenManager');

const articles = require('./api/articles');
const ArticlesService = require('./services/ArticlesService');

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const articlesService = new ArticlesService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // JWT Tokenize & Static Files
  await server.register([
    {
      plugin: Inert
    },
    {
      plugin: Jwt
    }
  ]);

  server.auth.strategy('emading_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      }
    }),
  });

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => {
        return ({
          status: 'success'
        });
      }
    },
    {
      method: 'GET',
      path: '/images/{param*}',
      handler: {
        directory: {
          path: Path.resolve('./public/images'),
        }
      }
    }
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return response.continue || response;
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
      },
      routes: {
        prefix: '/users'
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
      },
      routes: {
        prefix: '/authentications'
      }
    },
    {
      plugin: articles,
      options: {
        service: articlesService,
      },
      routes: {
        prefix: '/articles'
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}

init();