import { FullReport } from "../../@types/types.js"
import TransactionReporter from "../../utils/Transaction.js";
import TableCell from "./Table/TableCell.js";
import TableRow from "./Table/TableRow.js";
import BalanceChange from "./Table/BalanceChange.js";

export default class ReportMaker {
  private tableDataCell = new TableCell("td");
  private tableHeaderCell = new TableCell("th");
  private tableRowCell = new TableRow();
  private paragraph = new BalanceChange();

  private tableRows: HTMLTableRowElement[] = [];
  private reportSection: HTMLElement;

  constructor() {
    this.reportSection = document.querySelector(".report")! as HTMLElement;
    this.reportSection.innerHTML = `
      <button class="report--button__abled">보고서 받기</button>

      <em class="report--notice">새로고침 하시면 보고서가 초기화됩니다...!</em>

      <table
        class="app-table"
        width="50%"
        height="200"
        cellspacing="5"
        border="1"
      >
        <thead>
            <tr align="center">
                <th class="app-table--head" style="width:10%">날짜</th>
                <th class="app-table--head" style="width:50%">지갑</th>
                <th class="app-table--head" style="width:20%">코인</th>
                <th class="app-table--head" style="width:20%">거래량</th>
            </tr>
        </thead>

        <tbody id="tbody" class="table--body">
        </tbody>
      </table>
    `
    const reportGenerateButton = this.reportSection.querySelector(".report--button__abled")! as HTMLButtonElement;
    reportGenerateButton.addEventListener("click", this.generateReportHandler.bind(this));
  }
  
  private generateReport(fullReport: FullReport) {
    // [중요] key 값을 '숫자'로 변환하여 정렬하여야 제대로 정렬된다.
    Object.keys(fullReport)
    .sort((dateA, dateB) => {
      const num1 = +dateA.split("/").join("");
      const num2 = +dateB.split("/").join("");
      
      return num2 - num1;
    })
    .forEach((date, index) => {
      const tableClassName = index % 2 === 0 
      ? "app-table--body__even" 
      : "app-table--body__odd";
      
      // 거래일에 대한 테이블 데이터 셀을 생성한다.
      const tableAttrs = [ { key: "rowspan", value: fullReport[date].count + "" } ];
      const dateTableCellElem = this.tableHeaderCell.generate(date, tableClassName, tableAttrs);
      
      // 단일 일자에 대한 
      fullReport[date].reports.forEach(({ address, report }, addressIndex) => {
        const { count, changes } = report;
        
        if (count !== 0) {
          // 지갑 주소에 대한 테이블 데이터 셀을 생성한다.
          const tableAttrs = [ { key: "rowspan", value: count + "" } ];
          const addressTableCellElem = this.tableDataCell.generate(address, tableClassName, tableAttrs);
          
          // 코인 이름과 거래량에 대한 테이블 데이터 셀을 생성한다.
          changes.forEach((change, changeIndex) => {
            const [ tokenSymbol, balanceChange ] = Object.entries(change)[0];
            const cells = [];
            
            const tokenTableCellElem = this.tableDataCell.generate(tokenSymbol, tableClassName);
            const amountTableCellElem = this.tableDataCell.generate("", tableClassName);
            const paragraphElem = this.paragraph.generate(balanceChange);
            amountTableCellElem.appendChild(paragraphElem);
            
            if (changeIndex === 0) {
              if (addressIndex === 0) {
                cells.push(dateTableCellElem)
              }
              cells.push(addressTableCellElem)
            }
            cells.push(tokenTableCellElem)
            cells.push(amountTableCellElem)
            
            const tableRowElem = this.tableRowCell.generate(cells);
            
            this.tableRows.push(tableRowElem);
          })
        }
      })
    }); 
  }
  
  private async generateReportHandler() {
    // 로딩 시 버튼 비활성화
    const reportGenerateButton = this.reportSection.querySelector(".report--button__abled")! as HTMLButtonElement;
    reportGenerateButton.className = "report--button__disabled";

    const reporter = TransactionReporter.getInstance("desc");
    const fromLocalStorage = localStorage.getItem("addressList") || "[]"; 
    const addressList = JSON.parse(fromLocalStorage);
  
    const fullReport = await reporter.getFullReport(addressList);
    this.generateReport(fullReport);
    this.render();

    // 버튼 재활성화
    reportGenerateButton.className = "report--button__abled";
  }
  
  public render() {
    const tableBody = this.reportSection.querySelector(".table--body")! as HTMLTableSectionElement;
    this.tableRows.forEach(tableRow => {
      tableBody.appendChild(tableRow);
    });
  }
}