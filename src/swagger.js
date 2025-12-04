import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Swagger API cho User và Project",
    },
    servers: [
      {
        url: "http://localhost:3001/api",
      },
    ],
    components: {
      schemas: {
        // USER MODEL
        User: {
          type: "object",
          required: ["name", "email"],
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            age: { type: "number", default: 18 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // PROJECT MODEL
        Project: {
          type: "object",
          required: ["name", "owner"],
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
            },
            startDate: { type: "string", format: "date-time" },
            owner: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // ERROR RESPONSE
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            statusCode: { type: "number" },
            errorCode: { type: "string" },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js"], // quét toàn bộ file route
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
