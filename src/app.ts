import TransactionReporter from "./utils/transaction.js";
import WalletManager from "./utils/address.js";
import { FullReport } from "./@types/types.js"

new WalletManager();
const reporter = TransactionReporter.getInstance("desc");

const tableBodyElem = document.querySelector("#tbody")! as HTMLTableSectionElement
const generateButton = document.querySelector(".report--button")! as HTMLButtonElement;

const makeTable = function(fullReport: FullReport) {
  const tableRows: HTMLTableDataCellElement[][][] = [];

  // [중요] key 값을 '숫자'로 변환하여 정렬하여야 제대로 정렬된다.
  Object.keys(fullReport)
    .sort((dateA, dateB) => {
      const num1 = +dateA.split("/").join("");
      const num2 = +dateB.split("/").join("");

      return num2 - num1;
    })
    .forEach((date, index) => {
      const dates: HTMLTableDataCellElement[] = [];
      const addresses: HTMLTableDataCellElement[] = [];
      const tokens: HTMLTableDataCellElement[] = [];
      const amounts: HTMLTableDataCellElement[] = [];

      // 단일 일자에 대한 
      for (const { address, report } of fullReport[date].reports) {
        const { count, changes } = report;

        if (count === 0) { continue; }

        // 코인 이름과 거래량에 대한 테이블 데이터 셀을 생성한다.
        changes.forEach(change => {
          const [ tokenSymbol, balanceChange ] = Object.entries(change)[0];
          
          const tokenTd = document.createElement("td");
          tokenTd.textContent = tokenSymbol;
          tokenTd.classList.add(index % 2 === 0 ? "app-table--body__even" : "app-table--body__odd");
          const amountTd = document.createElement("td");
          amountTd.classList.add(index % 2 === 0 ? "app-table--body__even" : "app-table--body__odd");
          // amountTd.textContent = balanceChange + "";
          const paragraph = document.createElement("p");
          paragraph.textContent = balanceChange + "";
          paragraph.classList.add(
            balanceChange > 0 
            ? "app-table--transaction__in" 
            : balanceChange < 0 
              ? "app-table--transaction__out" 
              : "app-table--transaction"
          );
          amountTd.appendChild(paragraph);

          tokens.push(tokenTd);
          amounts.push(amountTd);
        })

        // 지갑 주소에 대한 테이블 데이터 셀을 생성한다.
        const addressTd = document.createElement("td");
        addressTd.textContent = address;
        addressTd.setAttribute("rowspan", count + "");
        addressTd.classList.add(index % 2 === 0 ? "app-table--body__even" : "app-table--body__odd");

        addresses.push(addressTd);
      }

      // 거래일에 대한 테이블 데이터 셀을 생성한다.
      const th = document.createElement("th");
      th.textContent = date;
      th.setAttribute("rowspan", fullReport[date].count + "");
      th.classList.add(index % 2 === 0 ? "app-table--body__even" : "app-table--body__odd");

      dates.push(th);

      tableRows.push([dates, addresses, tokens, amounts]);
    }); 

  return tableRows;
}

const generateReportHandler = function(): void {
  const fromLocalStorage = localStorage.getItem("addressList") || "[]"; 
  const addressList = JSON.parse(fromLocalStorage);
  
  reporter.getFullReport(addressList).then(fullReport => {
    const rows = makeTable(fullReport);

    rows.forEach(([ th, addrs, token, amount ]) => {
      const chunkLength: number[] = [];
      
      addrs.forEach(addr => {
        chunkLength.push(+addr.getAttribute("rowspan")!);
      })

      let count = 0;
      let chunkNumber = 0;
      
      token.forEach((each, index) => {
        const tr = document.createElement("tr");

        if (index === 0) {
          const tableHead = th[0];
          tr.appendChild(tableHead);
        }

        if (count === 0) {
          tr.appendChild(addrs[chunkNumber])
        }

        tr.appendChild(each)
        tr.appendChild(amount[index])

        tableBodyElem.appendChild(tr);

        count++;

        if (count === chunkLength[chunkNumber]) {
          count = 0;
          chunkNumber++;
        }
      })      
    })
  });
}

generateButton.addEventListener("click", generateReportHandler);
