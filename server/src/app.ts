import express from "express";
import router from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import { initializeDb } from "./lib/database";

export const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", `${process.env.FRONTENDURI}`],
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
(async () => {
  await initializeDb();
  app.listen(8000, () => {
    console.log("Server is running on port 3000");
  });
})();

export default app;
