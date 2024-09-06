const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("boom");
const Jwt = require("jsonwebtoken");
const PasswordHelper = require("../helpers/passwordHelper");

const failAction = (request, headers, error) => {
  throw error;
};

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super();
    this.secret = secret;
    this.db = db;
  }
  login() {
    return {
      path: "/login",
      method: "POST",
      config: {
        tags: ["api"],
        description: "Get token",
        notes: "Log in with username and password",
        auth: false,
        validate: {
          failAction,
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required(),
          },
        },
      },
      handler: async (request) => {
        try {
          const { username, password } = request.payload;

          const [user] = await this.db.read({
            username: username.toLowerCase(),
          });

          if (!user) {
            return Boom.unauthorized("The provided user not exists.");
          }

          const match = await PasswordHelper.compare(password, user.password);

          if (!match) {
            return Boom.unauthorized("Invalid credentials.");
          }

          const token = Jwt.sign(
            {
              username,
              id: user.id,
            },
            this.secret
          );

          return {
            token,
          };
        } catch (error) {
          console.log("Error on login: ", error);
        }
      },
    };
  }
}

module.exports = AuthRoutes;
