import * as cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import axios from "axios";
import { insertForexRowsQuery } from "./queries";
import { ForexResponse, YahooResponse } from "../interface";
import { periods } from "../config/constants";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/118.0.5993.90 Safari/537.36",

  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:116.0) " +
    "Gecko/20100101 Firefox/116.0",

  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) " +
    "AppleWebKit/605.1.15 (KHTML, like Gecko) " +
    "Version/16.3 Mobile/15E148 Safari/604.1",

  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/118.0.5993.90 Safari/537.36 Edg/118.0.2088.56",

  "Mozilla/5.0 (Linux; Android 13; Pixel 7) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/118.0.5993.90 Mobile Safari/537.36",

  "Mozilla/5.0 (X11; Linux x86_64; rv:116.0) " + "Gecko/20100101 Firefox/116.0",

  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) " +
    "AppleWebKit/605.1.15 (KHTML, like Gecko) " +
    "Version/16.3 Safari/605.1.15",

  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/118.0.5993.90 Safari/537.36 Edg/118.0.2088.56",

  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/118.0.5993.90 Safari/537.36 OPR/95.0.0.0",

  "Mozilla/5.0 (iPad; CPU OS 16_3 like Mac OS X) " +
    "AppleWebKit/605.1.15 (KHTML, like Gecko) " +
    "CriOS/118.0.5993.90 Mobile/15E148 Safari/604.1",
];

function getRandomUserAgent() {
  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex];
}

export async function scraper(
  options: { from: string; to: string; period: string } = {
    from: "USD",
    to: "INR",
    period: "1M",
  }
) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - periods["1Y"] || periods["1M"];

  let data = await scrapeForexDataFetch(
    options.from,
    options.to,
    startDate,
    endDate
  );

  if (!data) {
    data = await scrapeForexDataPuppeteer(
      options.from,
      options.to,
      startDate,
      endDate
    );
  }

  await insertForexRowsQuery(data, options.from, options.to);
  return data;
}

// Backup just in case the query does not work due to being blocked or other issues
export async function scrapeForexDataPuppeteer(
  from: string,
  to: string,
  startDate: number,
  endDate: number
): Promise<ForexResponse[]> {
  const quote = `${from}${to}=X`;
  const url = `https://finance.yahoo.com/quote/${encodeURIComponent(
    quote
  )}/history?period1=${startDate}&period2=${endDate}`;

  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
  );

  await page.setViewport({ width: 1280, height: 800 });

  const content = await page.content();
  const $ = cheerio.load(content);

  const data: ForexResponse[] = [];
  $('div[data-testid="history-table"] > div > table').each((_, element) => {
    const tds = $(element).find("td");

    for (let i = 0; i < tds.length; i += 7) {
      const date = new Date($(tds[i]).text()).toISOString();
      const open = $(tds[i + 1]).text();
      const high = $(tds[i + 2]).text();
      const low = $(tds[i + 3]).text();
      const close = $(tds[i + 4]).text();
      const adjClose = $(tds[i + 5]).text();
      const volume = $(tds[i + 6]).text();

      data.push({
        date,
        open,
        high,
        low,
        close,
        adjClose,
        volume,
      });
    }
  });

  await browser.close();
  return data;
}

// looked up a few requests from the network tab and found the query url
export async function scrapeForexDataFetch(
  from: string,
  to: string,
  startDate: number,
  endDate: number
): Promise<ForexResponse[]> {
  const yahoo_data_url = `https://query1.finance.yahoo.com/v8/finance/chart/${from}${to}=x`;

  const requestOptions = {
    method: "GET",
    url: yahoo_data_url,
    params: {
      events: "capitalGain|div|split",
      formatted: "true",
      includeAdjustedClose: "true",
      interval: "1d",
      period1: `${startDate}`,
      period2: `${endDate}`,
      symbol: `${from}${to}=X`,
      userYfid: "true",
      lang: "en-US",
    },
    headers: {
      Accept: "*/*",
      "User-Agent": getRandomUserAgent(),
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    },
  };

  const mappedData = [];
  try {
    const { data }: { data: YahooResponse } = await axios.request(
      requestOptions
    );

    const timestamps = data.chart.result[0].timestamp;

    const highs = data.chart.result[0].indicators.quote[0].high;
    const lows = data.chart.result[0].indicators.quote[0].low;
    const opens = data.chart.result[0].indicators.quote[0].open;
    const closes = data.chart.result[0].indicators.quote[0].close;
    const adj_closes = data.chart.result[0].indicators.adjclose[0].adjclose;

    let len = timestamps.length;

    for (let i = 0; i < len; i++) {
      mappedData.push({
        date: new Date(timestamps[i] * 1000).toISOString(),
        open: opens[i],
        close: closes[i],
        adjClose: adj_closes[i],
        low: lows[i],
        high: highs[i],
        volume: "-",
      });
    }
  } catch (error) {
    console.error(error);
  }
  return mappedData;
}
