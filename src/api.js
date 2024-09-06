const { join } = require('path')
const { config } = require('dotenv')
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "production" || env === "dev", "environment inválida! Ou prod ou dev")

const configPath = join('./config', `.env.${env}`)

config({
  path: configPath
})

const Hapi = require("hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDb = require("./db/strategies/mongodb/mongodb");
const Postgres = require("./db/strategies/postgres/postgres");
const UserSchema = require("./db/strategies/postgres/schemas/userSchema");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroSchema");
const HeroRoutes = require("./routes/heroRoutes");
const AuthRoutes = require("./routes/authRoutes");

const HapiSwagger = require("hapi-swagger");
const Vision = require("vision");
const Inert = require("inert");

const HapiJwt = require("hapi-auth-jwt2");
const JWT_SECRET = "SECRET_KEY";

const app = new Hapi.Server({
  port: process.env.PORT,
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function main() {
  const mongoConnection = MongoDb.connect();
  const mongoContext = new Context(new MongoDb(mongoConnection, HeroSchema));

  const postgresConnection = await Postgres.connect();
  const model = await Postgres.defineModel(postgresConnection, UserSchema);
  const postgresContext = new Context(new Postgres(postgresConnection, model));

  const swaggerOptions = {
    info: {
      title: "Heroes API",
      version: "v1.0",
    },
    lang: "en",
  };

  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.auth.strategy("jwt", "jwt", {
    key: JWT_SECRET,
    // options: {
    //   expiresIn: 24 * 60 * 60,
    // },
    validate: (data, request) => {
      const user = postgresContext.read({
        username: data.username.toLowerCase(),
      })

      return user ? { isValid: true } : { isValid: false };


    }
  });
  app.auth.default("jwt");

  app.route([
    ...mapRoutes(new HeroRoutes(mongoContext), HeroRoutes.methods()),
    ...mapRoutes(
      new AuthRoutes(JWT_SECRET, postgresContext),
      AuthRoutes.methods()
    ),
  ]);

  app.start();
  console.log(`Server running on port ${app.info.port}`);

  return app;
}

module.exports = main();
