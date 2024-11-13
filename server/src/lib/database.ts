import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export async function openDb() {
  return open({
    filename: "./forex_data.db",
    driver: sqlite3.Database,
  });
}

export async function initializeDb() {
  const db = await openDb();
  await createForexDataTable(db);
  await createScrapeLogTable(db);
}

async function createForexDataTable(db: Database) {
  return db.exec(`
  CREATE TABLE IF NOT EXISTS forex_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    adj_close REAL,
    volume TEXT,
    from_currency TEXT,
    to_currency TEXT,
    UNIQUE(date, from_currency, to_currency)
  )
`);
}

async function createScrapeLogTable(db: Database) {
  return db.exec(`
    CREATE TABLE IF NOT EXISTS scrape_log(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_currency TEXT,
    to_currency TEXT,
    last_scraped TEXT,
    UNIQUE(from_currency, to_currency)
    )`);
}
