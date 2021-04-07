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