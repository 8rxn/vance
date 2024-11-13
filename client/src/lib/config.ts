export const API_URL = import.meta.env.VITE_API_URL|| "http://localhost:3000";

export const CURRENCY_OPTIONS = {
  GBP: {
    symbol: "£",
    name: "British Pound",
    country: "UK",
    icon: "",
  },
  AED: {
    symbol: "د.إ",
    name: "United Arab Emirates Dirham",
    country: "UAE",
    icon: "",
  },
};

export const PERIOD_OPTIONS = [
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
];

export const DATAKEY_OPTIONS = ["close", "open", "high", "low", "adjClose"];
