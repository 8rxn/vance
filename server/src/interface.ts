export interface ForexResponse {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  adjClose: string;
  volume: string;
}

export interface YahooResponse {
  chart: {
    result: {
      meta?: {};
      timestamp: [];
      indicators: {
        quote: {
          high: [];
          close: [];
          open: [];
          low: [];
        }[];
        adjclose: {
          adjclose: [];
        }[];
      };
    }[];
  };
}
