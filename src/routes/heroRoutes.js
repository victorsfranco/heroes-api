const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("boom");

const failAction = (request, headers, error) => {
  throw error;
};

const headers = Joi.object({
  authorization: Joi.string().required(),
}).unknown()

class HeroRoute extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: "/heroes",
      method: "GET",
      config: {
        tags: ['api'],
        description: "Should list heroes",
        notes: "Able to paginate results and filter by name.",
        validate: {
          // Can validate payload, headers, params, query...
          failAction,
          headers,
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            name: Joi.string().min(3).max(100),
          },
        },
      },
      handler: async (request) => {
        try {
          const { skip, limit, name } = request.query;

          const query = name
            ? {
              name: { $regex: `.*${name}*.` },
            }
            : {};

          const result = await this.db.read(query, skip, limit);

          return result;
        } catch (error) {
          console.log("Error on get heroes: ", error);
          return Boom.internal();
        }
      },
    };
  }

  create() {
    return {
      path: "/heroes",
      method: "POST",
      config: {
        tags: ['api'],
        description: "Should create a new hero",
        notes: "Use the name and power properties to create a new hero.",
        validate: {
          failAction,
          headers,
          payload: {
            name: Joi.string().required().min(3).max(100),
            power: Joi.string().required().min(2).max(100),
          },
        },
      },
      handler: async (request) => {
        try {
          const { name, power } = request.payload;

          const result = await this.db.create({ name, power });

          return {
            message: "Hero created successfully.",
            _id: result._id,
          };
        } catch (error) {
          console.log("Error on create hero: ", error);
          return Boom.internal();
        }
      },
    };
  }

  update() {
    return {
      path: "/heroes/{id}",
      method: "PATCH",
      config: {
        tags: ['api'],
        description: "Should update a existent hero",
        notes: "Receive the updated props and the id of the hero to update.",
        validate: {
          failAction,
          headers,
          params: {
            id: Joi.string().required(),
          },
          payload: {
            name: Joi.string().min(3).max(100),
            power: Joi.string().min(2).max(100),
          },
        },
      },
      handler: async (request) => {
        try {
          const {
            params: { id },
            payload,
          } = request;

          // Remove undefined props
          const stringData = JSON.stringify(payload);
          const data = JSON.parse(stringData);

          const result = await this.db.update(id, data);

          if (result.modifiedCount !== 1) {
            return Boom.preconditionFailed(
              "It was not possible to update the hero provided, because it was not found in database"
            );
          }

          return {
            message: "Hero updated successfully.",
            modifiedCount: result.modifiedCount,
          };
        } catch (error) {
          console.log("Error on update hero: ", error);
          return Boom.internal();
        }
      },
    };
  }

  delete() {
    return {
      path: "/heroes/{id}",
      method: "DELETE",
      config: {
        tags: ['api'],
        description: "Should delete a existent hero",
        notes: "Receives a Id to locate and delete the hero.",
        validate: {
          failAction,
          headers,
          params: {
            id: Joi.string().required(),
          },
        },
      },
      handler: async (request) => {
        try {
          const {
            params: { id },
          } = request;

          const { deletedCount } = await this.db.delete(id);

          if (deletedCount !== 1) {
            return Boom.preconditionFailed(
              "It was not possible to delete the hero provided, because it was not found in database"
            );
          }

          return {
            message: "Hero deleted Successfully.",
            deletedCount,
          };
        } catch (error) {
          console.error("Error on delete hero.");
          return Boom.internal("Error on delete hero.");
        }
      },
    };
  }
}
module.exports = HeroRoute;
