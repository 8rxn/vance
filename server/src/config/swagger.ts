// src/config/swagger.ts

import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Forex Data API",
      version: "1.0.0",
      description: "Vance FullStack API for fetching and managing forex exchange rate data",
      contact: {
        name: "Raj Aryan Vance Forex Data API",
        url: "http://forex-api.aryn.wtf/",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
      {
        url: "https://forex-api.aryn.wtf",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        ForexData: {
          type: "object",
          properties: {
            date: {
              type: "string",
              format: "date-time",
              description: "Date of the exchange rate",
            },
            open: {
              type: "string",
              description: "Opening exchange rate",
            },
            high: {
              type: "string",
              description: "Highest exchange rate of the day",
            },
            low: {
              type: "string",
              description: "Lowest exchange rate of the day",
            },
            close: {
              type: "string",
              description: "Closing exchange rate",
            },
            adjClose: {
              type: "string",
              description: "Adjusted closing exchange rate",
            },
            volume: {
              type: "string",
              description: "Trading volume",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes.ts"], // Path to the API routes
};

export const specs = swaggerJsdoc(options);
