
export interface ForexData {
    date: string;
    close: number;
    open: number;
    high: number;
    low: number;
    adjClose: number;
  }
  
export type DataKeyOptions = "close" | "open" | "adjClose" | "high" | "low";