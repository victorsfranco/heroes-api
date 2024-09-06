const ICrud = require("../interfaces/crud");
const Sequelize = require("sequelize");

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.log("An error as ocurred: ", error);
      return false;
    }
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);
    await model.sync();
    return model;
  }

  static async connect() {
    const connection = new Sequelize(process.env.POSTGRES_URL,
      {
        host: "localhost",
        dialect: "postgres",
        quoteIdentifiers: false,
        logging: false,
        ssl: process.env.SSL_DB,
        dialectOptions: {
          ssl: process.env.SSL_DB
        }
      }
    );
    return connection;
  }
  async create(item) {
    const { dataValues } = await this._schema.create(item);
    return dataValues;
  }

  async read(item) {
    const result = this._schema.findAll({ where: item, raw: true });
    return result;
  }

  async update(id, newData, upsert = false) {
    const fn = upsert ? "upsert" : "update";
    const result = await this._schema[fn](newData, { where: { id: id } });
    return result;
  }

  async delete(id) {
    const query = id ? { id } : {};
    const result = await this._schema.destroy({ where: query });

    return result;
  }
}

module.exports = Postgres;
