
import { Router, Request, Response } from "express";
import { getForexData } from "./handlers/forex";
import { scrapeAll, scrapeOnDemand } from "./handlers/scrape";

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     description: Returns a welcome message
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Forex Data API"
 */
router.get("/", (req: Request, res: Response) => {
  res.send("Forex Data API");
});

/**
 * @openapi
 * /api/forex-data:
 *   post:
 *     summary: Get forex exchange rate data
 *     description: Retrieves historical forex data for a specified currency pair and time period
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Source currency code (e.g., USD, GBP)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Target currency code (e.g., INR, EUR)
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [1W, 1M, 3M, 6M, 1Y]
 *           default: 1M
 *         description: Time period for historical data
 *     responses:
 *       200:
 *         description: Historical forex data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ForexData'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/api/forex-data", getForexData);

/**
 * @openapi
 * /api/forex-data/scrape/all:
 *   post:
 *     summary: Scrape all configured currency pairs
 *     description: Initiates scraping of forex data for all configured currency pairs
 *     responses:
 *       200:
 *         description: Scraping initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Accepted, Scraping"  
 */
router.post("/api/forex-data/scrape/all", scrapeAll);

/**
 * @openapi
 * /api/forex-data/scrape:
 *   post:
 *     summary: Scrape forex data for specific currency pair
 *     description: Initiates scraping of forex data for a specified currency pair and period
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Source currency code
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Target currency code
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [1W, 1M, 3M, 6M, 1Y]
 *           default: 1W
 *         description: Time period for scraping
 *     responses:
 *       200:
 *         description: Scraped forex data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ForexData'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/api/forex-data/scrape", scrapeOnDemand);

export default router;