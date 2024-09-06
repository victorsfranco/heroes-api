const ICrud = require("../interfaces/crud");

const Mongoose = require("mongoose");

Mongoose.connect(
  process.env.MONGODB_URL
).catch((error) => {
  console.log("Connection Error: ", error);
});

const STATUS = {
  0: "Disconnected",
  1: "Connected",
  2: "Connecting",
  3: "Disconnecting",
};
class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState];
    if (state === "Connected") return state;
    if (state !== "Connecting") return state;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return STATUS[this._connection.readyState];
  }

  static connect() {
    Mongoose.connect(
      process.env.MONGODB_URL
    ).catch((error) => {
      console.log("Connection Error: ", error);
    });

    const connection = Mongoose.connection;
    connection.once("open", () => console.info("Database Running!\n"));
    return connection;
  }

  async create(item) {
    return await this._schema.create(item);
  }

  read(query, skip = 0, limit = 10) {
    return this._schema.find(query).skip(skip).limit(limit);
  }

  update(id, data) {
    return this._schema.updateOne({ _id: id }, { $set: data });
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
