import { currencyPairs } from "../config/constants";
import { getLastScrapeLog, insertScrapeLog } from "./queries";
import { scraper } from "./scraper";

const periods = {
  week: "1W",
  month: "1M",
  quarter: "3M",
  halfyear: "6M",
  year: "1Y",
};

export async function runScraper() {
  for (const pair of currencyPairs) {
    let period = periods.week;
    const last_scraped = await getLastScrapeLog(pair.from, pair.to);

    if (!last_scraped) {
      period = periods.year;
    }

    const data = await scraper({ ...pair, period });
    if (data) {
      await insertScrapeLog(pair.from, pair.to);
    }
  }
}

if (require.main === module) {
  runScraper();
}
