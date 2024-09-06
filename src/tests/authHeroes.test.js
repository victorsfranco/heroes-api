const assert = require("assert");
const api = require("../api");
const Context = require("../db/strategies/base/contextStrategy");
const Postgres = require("../db/strategies/postgres/postgres");
const UsersSchema = require("../db/strategies/postgres/schemas/userSchema");
let app = {};
const USER = {
  username: "francovictor.dev",
  password: "123",
};

const USER_DB = {
  username: USER.username.toLowerCase(),
  password: "$2b$04$80h4kWE9Th8iRve3IYd3PO1tiaKgod/2eMGzGS/gF2ibJN124aCmi",
};

describe("Auth Routes", function () {
  this.beforeAll(async () => {
    app = await api;

    const postgresConnection = await Postgres.connect();
    const model = await Postgres.defineModel(postgresConnection, UsersSchema);
    const postgres = new Context(new Postgres(postgresConnection, model));
    await postgres.update(null, USER_DB, true);
  });

  it("Get a Token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: USER,
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(data.token.length > 10);
  });

  it("Should fail on invalid user", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: 'WrongUser',
        password: "123456",
      },
    });

    const statusCode = result.statusCode
    const data = JSON.parse(result.payload)

    assert.deepEqual(statusCode, 401)
    assert.deepEqual(data.error, 'Unauthorized')
  })
});
