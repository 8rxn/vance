import { Router, Request, Response } from "express";
import { getForexData } from "./handlers/forex";
import { scrapeAll, scrapeOnDemand } from "./handlers/scrape";

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.send("Forex Data API");
});
router.post("/api/forex-data", getForexData);
router.post("/api/forex-data/scrape/all", scrapeAll);
router.post("/api/forex-data/scrape", scrapeOnDemand);

export default router;
