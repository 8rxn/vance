import { Request, Response } from "express";
import { scraper } from "../lib/scraper";
import { runScraper } from "../lib/scrape-cron";
import { periods } from "../config/constants";

export async function scrapeOnDemand(req: Request, res: Response) {
  let { from, to, period = "1W" } = req.query;

  if (!(from && to)) {
    let missing = [];
    if (!from) missing.push("from");
    if (!to) missing.push("to");

    res.status(400).json({
      message: "Missing Param: " + missing.join(","),
    });
    return;
  }

  if (!Object.keys(periods).includes(period as string)) {
    res.status(400).json({
      message:
        "Invalid Period, Available periods: " + Object.keys(periods).join(", "),
    });
    return;
  }

  const data = await scraper({
    from: `${from}`,
    to: `${to}`,
    period: `${period}`,
  });

  res.status(200).json({ data });
}

export async function scrapeAll(_: Request, res: Response) {
  res.json({ message: "Accepted, Scraping" });
  runScraper();
}
