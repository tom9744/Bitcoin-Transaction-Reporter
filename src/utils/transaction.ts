import { parseValue, parseDate } from "./parser.js";
import { Record, ParsedRecord } from "../@types/types.js"

interface DailyTokenReport { 
  count: number,
  changes: Array<{ [tokenSymbol: string]: number }> 
}

// interface FullReport { 
//   [date: string]: DailyTokenReport
// }

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
      const year = record.parsedDate.getFullYear();
      const month = record.parsedDate.getMonth() + 1;
      const date = record.parsedDate.getDate();
      
      !acc[`${year}/${month}/${date}`] 
        ? acc[`${year}/${month}/${date}`] = [{ ...record }]
        : acc[`${year}/${month}/${date}`].push({  ...record });

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
      if(record.tokenSymbol !== "") {
        !acc[record.tokenSymbol] 
        ? acc[record.tokenSymbol] = [record]
        : acc[record.tokenSymbol].push(record);
      }

      return acc;
    }, {});

    return groupedRecords;
  }

  private getReport(address: string) {
    return fetch(`${this.baseUrl}?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=${this.sortingMethod}&apikey=${this.apiKey}`)
    .then(response => {
      if (!response.ok) {
        const error = new Error("API 호출에 실패했습니다!");
        throw error;
      }
      return response.json();
    })
    .then(({ result: records }) => this.simplify(records, address))
    .then(parsedRecords => this.groupByDate(parsedRecords))
    .then(recordGroupedByDate => {
      const recordGroupedByDateAndToken: { [date: string] : { [tokenSymbol: string] : Array<ParsedRecord> } } = {};
      
      Object.keys(recordGroupedByDate).forEach((date: string) => {
        recordGroupedByDateAndToken[date] = this.groupByToken(recordGroupedByDate[date]);
      });

      return recordGroupedByDateAndToken;
    })
    // 단일 지갑에서 하루동안 거래된 코인들의 최종 거래량을 구한다.
    .then(grupedByDateAndToken => {
      const balanceChangePerDate: { [date: string]: DailyTokenReport } = {};

      // 일자별 거래 내역에 대해 다음의 로직을 수행한다.
      Object.keys(grupedByDateAndToken).forEach(date => {
        const balanceChangePerToken: DailyTokenReport = { 
          count: Object.keys(grupedByDateAndToken[date]).length,  // 해당 일자에 거래된 코인의 가지수
          changes: []
        };

        // 당일 거래된 코인에 대해, 입금/출금액을 모두 더해 최종 거래량을 산출한다.
        Object.keys(grupedByDateAndToken[date]).forEach(token => {
          const balanceChange = grupedByDateAndToken[date][token].reduce((acc, { parsedValue }) => acc + parsedValue, 0);

          balanceChangePerToken.changes.push({ [token]: balanceChange });
        });

        // 당일 거래된 코인들에 대한 최종 거래량 산출 결과를 종합 보고서에 추가한다. 
        balanceChangePerDate[date] = balanceChangePerToken;
      });

      return balanceChangePerDate;
    })
    .catch(error => {
      // TODO: 보다 강인한 에러 처리
      alert(error);
    });
  }

  public async getFullReport(addresses: string[]) {
    console.log("[SYSTEM] Started Loading Transaction Data...");
      
    const startTime = new Date().getTime();
    const fullReport: { [prop: string]: Array<{ address: string, report: DailyTokenReport }> } = {};

    // 순차적 비동기 처리
    for (const address of addresses) {
      const report = await this.getReport(address);

      if (!report) { continue; }
      
      Object.keys(report).forEach(date => {
        !fullReport[date]
          ? fullReport[date] = [ { address: address, report: report[date] } ]
          : fullReport[date].push({ address: address, report: report[date] });
      });
    }
    const endTime = new Date().getTime();

    console.log(`총 수행시간: ${endTime - startTime}ms`);

    return fullReport;
  }
}