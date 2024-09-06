const assert = require("assert");
const Postgres = require("../db/strategies/postgres/postgres");
const HeroSchema = require("../db/strategies/postgres/schemas/heroSchema");
const Context = require("../db/strategies/base/contextStrategy");

const MOCK_CREATE_HERO = {
  name: "Spider-Man",
  power: "Spider Sense",
};

const MOCK_UPDATE_HERO = {
  name: "Iron Man",
  power: "Armor",
};

let context = {}

describe("Postgres Strategy", function () {
  this.timeout(Infinity);
  this.beforeAll(async function () {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroSchema)
    context = new Context(new Postgres(connection, model))
    await context.delete();
    await context.create(MOCK_UPDATE_HERO);
  });

  it("PostgreSQL Connection", async function () {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it("create", async function () {
    const result = await context.create(MOCK_CREATE_HERO);
    delete result.id;
    assert.deepEqual(result, MOCK_CREATE_HERO);
  });

  it("read", async function () {
    const [result] = await context.read({ name: MOCK_CREATE_HERO.name });
    delete result.id;
    assert.deepEqual(result, MOCK_CREATE_HERO);
  });

  it("update", async function () {
    const [recordToBeUpdated] = await context.read({
      name: MOCK_UPDATE_HERO.name,
    });
    const newItem = {
      ...MOCK_UPDATE_HERO,
      name: "Aquaman",
    };

    const [updatedRows] = await context.update(recordToBeUpdated.id, newItem);
    const [updatedItem] = await context.read({ id: recordToBeUpdated.id });

    assert.deepEqual(updatedRows, 1);
    assert.deepEqual(updatedItem.name, newItem.name);
  });

  it("delete by id", async function () {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  });
});
