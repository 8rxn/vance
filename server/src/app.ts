// src/app.ts

import express from "express";
import router from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import { initializeDb } from "./lib/database";
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

export const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:8000" , `${process.env.FRONTENDURI}`],
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(router);

(async () => {
  await initializeDb();
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
    console.log("API documentation available at http://localhost:8000/api-docs");
  });
})();

export default app;