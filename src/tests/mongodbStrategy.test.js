const assert = require("assert");
const MongoDb = require("../db/strategies/mongodb/mongodb");
const heroSchema = require("../db/strategies/mongodb/schemas/heroSchema");
const Context = require("../db/strategies/base/contextStrategy");

const MOCK_CREATE_HERO = {
  name: "Spider-Man",
  power: "Spider Sense",
};

const MOCK_DEFAULT_HERO = {
  name: `Flash-${Date.now()}`,
  power: "Speed",
};

const MOCK_UPDATE_HERO = {
  name: `Aquaman-${Date.now()}`,
  power: "Water",
};

let MOCK_HERO_ID = "";

let context = {};

describe("Mongodb Strategy", function () {
  this.beforeAll(async function () {
    const connection = MongoDb.connect();
    context = new Context(new MongoDb(connection, heroSchema));
    context.create(MOCK_DEFAULT_HERO);
    const result = await context.create(MOCK_UPDATE_HERO);
    MOCK_HERO_ID = result._id;
  });

  it("Verify connection", async () => {
    const result = await context.isConnected();
    const expected = "Connected";
    assert.deepEqual(result, expected);
  });

  it("Create new Hero", async () => {
    const { name, power } = await context.create(MOCK_CREATE_HERO);
    assert.deepEqual({ name, power }, MOCK_CREATE_HERO);
  });

  it("Get heroes", async () => {
    const [{ name, power }] = await context.read({
      name: MOCK_DEFAULT_HERO.name,
    });

    const result = {
      name,
      power,
    };

    assert.deepEqual(result, MOCK_DEFAULT_HERO);
  });

  it("Update hero", async () => {
    const { modifiedCount } = await context.update(MOCK_HERO_ID, {
      name: "Batman",
    });

    assert.deepEqual(modifiedCount, 1);
  });

  it("Delete hero", async () => {
    const { deletedCount } = await context.delete(MOCK_HERO_ID);

    assert.deepEqual(deletedCount, 1);
  });
});
