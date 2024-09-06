const assert = require("assert");
const api = require("../api");
let app = {};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZyYW5jb3ZpY3Rvci5kZXYiLCJpZCI6MSwiaWF0IjoxNzI1MTE2NTk3fQ.-vWO31dJX-K5PuqMhIXe5DaeosoXQaNz_6vAuTu5Edk'

const headers = {
  Authorization: TOKEN
}

const MOCK_REGISTER_HERO = {
  name: "Red Chapolin",
  power: "Bionic Hammer",
};

const MOCK_INITIAL_HERO = {
  name: "Thor",
  power: "Weather Manipulation",
};

const MOCK_UPDATED_HERO = {
  name: "Thor",
  power: "Weather Manipulation and Superhuman strength",
};

let MOCK_ID = "";

describe("Heroes Routes", function () {
  this.beforeAll(async () => {
    app = await api;

    const { payload } = await app.inject({
      method: "POST",
      url: "/heroes",
      headers,
      payload: MOCK_INITIAL_HERO,
    });

    const { _id } = JSON.parse(payload);

    MOCK_ID = _id;
  });

  it("(GET) /heroes", async () => {
    const result = await app.inject({
      method: "GET",
      headers,
      url: "/heroes",
    });

    const data = JSON.parse(result.payload);

    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(data));
  });

  it("(GET) /heroes - limit search", async () => {
    const MAX_LENGTH = 10;
    const result = await app.inject({
      method: "GET",
      headers,
      url: `/heroes?skip=0&limit=${MAX_LENGTH}`,
    });

    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(data.length === MAX_LENGTH);
  });

  it("(GET) /heroes - Filter search", async () => {
    const MAX_LENGTH = 5;
    const NAME = "Spider-Man";
    const result = await app.inject({
      method: "GET",
      headers,
      url: `/heroes?skip=0&limit=${MAX_LENGTH}&name=${NAME}`,
    });

    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(data[0].name === NAME);
  });

  it("(POST) /heroes - Create", async () => {
    const { payload, statusCode } = await app.inject({
      method: "POST",
      headers,
      url: "/heroes",
      payload: MOCK_REGISTER_HERO,
    });

    const { message, _id } = JSON.parse(payload);

    assert.ok(statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, "Hero created successfully.");
  });

  it("(PATCH) /heroes/:id - Update", async () => {
    const _id = MOCK_ID;

    const { payload, statusCode } = await app.inject({
      method: "PATCH",
      headers,
      url: `/heroes/${_id}`,
      payload: { power: MOCK_UPDATED_HERO.power },
    });

    const data = JSON.parse(payload);

    assert.ok(data.modifiedCount === 1);
    assert.ok(statusCode === 200);
    assert.deepEqual(data.message, "Hero updated successfully.");
  });

  it("(DELETE) /heroes/:id - Delete", async () => {
    const _id = MOCK_ID;
    const { statusCode, payload } = await app.inject({
      method: "DELETE",
      headers,
      url: `/heroes/${_id}`,
    });

    const data = JSON.parse(payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(data.message, "Hero deleted Successfully.");
  });
});
