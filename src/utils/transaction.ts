import { parseValue, parseDate } from "./parser.js";
import { Record, ParsedRecord, DailyTokenReport, FullReport } from "../@types/types.js"

export default class TransactionReporter {
  private baseUrl = "https://api.etherscan.io/api";
  private apiKey = "12ZSBIZUKUNEX6IEZWMBQ1TCFT3PPMV9RE";
  private sortingMethod: "asc" | "desc";
  private static instance: TransactionReporter;

  private constructor(sortingMethod: "asc" | "desc") {
    this.sortingMethod = sortingMethod;
  }

  static getInstance(sortingMethod: "asc" | "desc") {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new TransactionReporter(sortingMethod);
    return this.instance;
  }

  /**
   * 원본 JSON 객체에서 필요한 속성만 선택하여, 새로운 객체를 만들어 반환한다.
   * @param records 
   * @param walletAddress 
   * @returns 
   */
  private simplify(records: Array<Record>, walletAddress: string) : Array<ParsedRecord> {
    return records.map(({ value, tokenDecimal, tokenSymbol, from, timeStamp }) => {
      const parsedDate = parseDate(timeStamp);
      const parsedValue = walletAddress.toUpperCase() === from.toUpperCase() 
        ? -parseValue(value, tokenDecimal)
        : parseValue(value, tokenDecimal);
  
      return { parsedValue, tokenSymbol, parsedDate };
    });
  }

  /**
   * 주어진 Records를 Date 별로 묶어, 객체 형태로 반환한다.
   * @param {Object} records 
   * @returns YYYY/MM/DD 형태의 문자열을 key로 가지는 객체 
   */
  private groupByDate(records: Array<ParsedRecord>) {
    const groupedRecords = records.reduce((acc: { [date: string] : Array<ParsedRecord> }, record: ParsedRecord) => {
      const { parsedDate } = record;
      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth() + 1;
      const date = parsedDate.getDate();
      const yearMonthDate = `${year}/${month < 10 ? `0${month}` : month}/${date < 10 ? `0${date}` : date}`;
      
      // YYYY/MM/DD가 이미 key로 존재하면 배열에 push()하고, 없다면 새로 생성한다.
      !acc[yearMonthDate] 
        ? acc[yearMonthDate] = [{ ...record }]
        : acc[yearMonthDate].push({  ...record });

      return acc;
    }, {});

    return groupedRecords;
  }

  /**
   * 주어진 Records를 Token 별로 묶어, 객체 형태로 반환한다.
   * @param {Object} records 
   * @returns tokenSymbol을 key로 가지는 객체
   */
  private groupByToken(records: Array<ParsedRecord>) {
    const groupedRecords = records.reduce((acc: { [tokenSymbol: string] : Array<ParsedRecord> }, record: ParsedRecord) => {
      const { tokenSymbol } = record;

      // TokenSymbol이 빈 문자열인 경우를 제외하며, TokenSymbol이 이미 key로 존재하면 배열에 push()하고, 없다면 새로 생성한다.
      tokenSymbol !== "" && !acc[tokenSymbol] 
        ? acc[tokenSymbol] = [record]
        : acc[tokenSymbol].push(record);

      return acc;
    }, {});

    return groupedRecords;
  }

  /**
   * 일별 코인 거래 내역을 받아와, 거래된 코인의 가지수와 최종 거래량(+, -)을 구해 반환한다.
   * @param transactionPerToken 일별 코인 거래 내역
   * @returns 거래된 코인의 가지수와 코인 별 최종 거래량
   */
  private getDailySummary(transactionPerToken: { [tokenSymbol: string]: ParsedRecord[] }) {
    const transferPerToken: DailyTokenReport = { 
      count: Object.keys(transactionPerToken).length,  // 해당 일자에 거래된 코인의 가지수
      changes: []
    };

    // 당일 거래된 코인들의 입금/출금액을 모두 더해, 일일 최종 거래량을 구한다.
    Object.keys(transactionPerToken).forEach(token => {
      const summary = transactionPerToken[token].reduce((acc, { parsedValue }) => acc + parsedValue, 0);

      transferPerToken.changes.push({ [token]: summary });
    });

    return transferPerToken;
  }

  /**
   * 인자로 전달된 지갑 주소에 대해한 종합 보고서를 생성한다.
   * @param address 지갑 주소
   * @returns API 호출 후 도착한 파싱한 
   */
  private async getSingleAddressReport(address: string) {
    try {
      const response = await fetch(`${this.baseUrl}?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=${this.sortingMethod}&apikey=${this.apiKey}`);

      if (!response.ok) {
        const error = new Error("API 호출에 실패했습니다!");
        throw error;
      }

      const { result } = await response.json();      
      const simplifiedDate = this.simplify(result, address);
      const groupedByDate =  this.groupByDate(simplifiedDate);
      const groupedByDateAndToken: { 
        [date: string] : { 
          [tokenSymbol: string] : ParsedRecord[]
        } 
      } = {};
      
      // 날짜 단위로 묶인 거래내역 그룹 각각에 대해, 다시 한번 코인별로 묶는다.
      Object.keys(groupedByDate).forEach((date: string) => {
        groupedByDateAndToken[date] = this.groupByToken(groupedByDate[date]);
      });
  
      const singleAddressReport: { [date: string]: DailyTokenReport } = {};
  
      // 날짜 단위로 묶인 거래내역에 대해, 해당 일자에 거래된 코인의 최종 거래량을 산출한다. 
      Object.keys(groupedByDateAndToken).forEach(date => {
        singleAddressReport[date] = this.getDailySummary(groupedByDateAndToken[date]);
      });
  
      return singleAddressReport;
    } 
    catch (error) {
      // TODO: 보다 강인한 에러 처리
      alert(error.message);

      return;
    }
  }

  /**
   * 인자로 전달받은 '지갑 주소 배열'의 각 요소들에 대한 단일 보고서를 생성하고, 최종 보고서로 완성한다.
   * @param addresses 지갑 주소의 배열
   * @returns 최종 보고서
   */
  public async getFullReport(addresses: string[]) {
    const startTime = new Date().getTime();
    console.log("[SYSTEM] Started Loading Transaction Data...");
    
    const fullReport: FullReport = {};

    // [순차적 비동기 처리] 지갑 주소 각각에 대한 보고서를 생성하고, 종합 보고서 객체를 생성한다.
    for (const address of addresses) {
      const report = await this.getSingleAddressReport(address);

      if (!report) { continue; }
      
      // 단일 보고서를 하나의 종합 보고서에 병합한다.
      Object.keys(report).forEach(date => {
        if (!fullReport[date]) {
          fullReport[date] = {
            count: report[date].count,
            reports: [ { address: address, report: report[date] } ]
          };
        } else {
          fullReport[date].count += report[date].count;
          fullReport[date].reports.push({ address: address, report: report[date] });
        }
      });
    }

    const endTime = new Date().getTime();
    console.log(`총 수행시간: ${endTime - startTime}ms`);

    return fullReport;
  }
}