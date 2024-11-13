export const daySeconds = 24 * 60 * 60;

export const periods: { [key: string]: number } = {
  "1W": 7 * daySeconds,
  "1M": 30 * daySeconds,
  "3M": 90 * daySeconds,
  "6M": 180 * daySeconds,
  "1Y": 365 * daySeconds,
};

// currency pairs to scrape
export const currencyPairs = [
  { from: "GBP", to: "INR" },
  { from: "AED", to: "INR" },
];