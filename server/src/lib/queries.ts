import { openDb } from "./database";

export async function getForexDataQuery(
  from: string,
  to: string,
  startDate: number,
  endDate: number
) {
  const db = await openDb();
  return db.all(
    `
      SELECT date, open, high, low, close, adj_close as adjClose, volume
      FROM forex_data
      WHERE from_currency = ? AND to_currency = ? 
        AND date(date) BETWEEN date(?, 'unixepoch') AND date(?, 'unixepoch')
      ORDER BY date
    `,
    [from, to, startDate, endDate]
  );
}

export async function getLastScrapeLog(from: string, to: string) {
  const db = await openDb();
  return db.get(
    `
        SELECT last_scraped
        FROM scrape_log
        WHERE from_currency = ? AND to_currency = ?`,
    [from, to]
  );
}


export async function insertScrapeLog(from: string, to: string) {
  const db = await openDb();

  return db.run(
    `
        INSERT OR IGNORE INTO scrape_log
        (from_currency, to_currency, last_scraped)
        VALUES (?, ?, ?)
      `,
    [from, to, new Date().toISOString()]
  );
}


export async function insertForexRowsQuery(data: any[], from: string, to: string) {
    const db = await openDb();
    const insertPromises = data.map((entry) => {
      return db.run(
        `
        INSERT OR IGNORE INTO forex_data
        (date, open, high, low, close, adj_close, volume, from_currency, to_currency)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          entry.date,
          entry.open,
          entry.high,
          entry.low,
          entry.close,
          entry.adjClose,
          entry.volume,
          from,
          to,
        ]
      );
    });
  
    await Promise.all(insertPromises);
  }
  