export interface Record {
  value: string,
  timeStamp: string,
  from: string,
  tokenDecimal: string,
  tokenSymbol: string,
}

export interface ParsedRecord {
  parsedValue: number,
  tokenSymbol: string, 
  parsedDate: Date
}

export interface Report {
  [prop: string]: number 
};

export interface DailyTokenReport { 
  count: number,
  changes: Array<{ [tokenSymbol: string]: number }> 
}

export interface FullReport {
  [date: string]: {
    count: number,
    reports: Array<{ address: string, report: DailyTokenReport }>
  } 
}