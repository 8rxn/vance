import { Request, Response } from "express";

import { scraper } from "../lib/scraper";
import { getForexDataQuery } from "../lib/queries";
import { periods } from "../config/constants";

export async function getForexData(req: Request, res: Response) {
  const fromCurrency = req.query.from as string;
  const toCurrency = req.query.to as string;
  const period = (req.query.period as string) || "1M";

  if (!Object.keys(periods).includes(period.toUpperCase())) {
    res.status(400).json({
      message:
        "Invalid Period, Available periods: " + Object.keys(periods).join(", "),
    });
    return;
  }

  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - (periods[period.toUpperCase()] || periods["1M"]);

  if (!fromCurrency || !toCurrency) {
    res.status(400).json({ error: "from and to parameters are required" });
    return;
  }

  try {
    const rows = await getForexDataQuery(
      fromCurrency,
      toCurrency,
      startDate,
      endDate
    );

    if (rows.length === 0) {
      const data = await scraper({
        from: fromCurrency,
        to: toCurrency,
        period: period,
      });

      res.json(data);
    } else {
      res.json(rows);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
  return;
}
