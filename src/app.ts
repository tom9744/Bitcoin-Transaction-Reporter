import TransactionReporter from "./utils/transaction.js";
import WalletManager from "./utils/address.js";
// import { Report } from "./@types/types.js"

interface DailyTokenReport { 
  count: number,
  changes: Array<{ [tokenSymbol: string]: number }> 
}

new WalletManager();
const reporter = TransactionReporter.getInstance("desc");

const tableBodyElem = document.querySelector("#tbody")! as HTMLTableSectionElement
const generateButton = document.querySelector(".report--button")! as HTMLButtonElement;

const makeTable = function(fullReport: {
  [date: string]: {
      address: string;
      report: DailyTokenReport;
  }[];
}) {

  console.log(fullReport);
  
  const tableRows: HTMLTableDataCellElement[][][] = [];
  
  Object.keys(fullReport).forEach(date => {
    const dates: HTMLTableDataCellElement[] = [];
    const addresses: HTMLTableDataCellElement[] = [];
    const tokens: HTMLTableDataCellElement[] = [];
    const amounts: HTMLTableDataCellElement[] = [];

    let globalCount = 0;

    // 단일 일자에 대한 
    for (const { address, report } of fullReport[date]) {
      const { count, changes } = report;

      if (count === 0) {
        continue;
      }

      // 
      changes.forEach(change => {
        const [ tokenSymbol, balanceChange ] = Object.entries(change)[0];
        
        const tokenTd = document.createElement("td");
        tokenTd.textContent = tokenSymbol;
        const amountTd = document.createElement("td");
        amountTd.textContent = balanceChange + "";

        tokens.push(tokenTd);
        amounts.push(amountTd);

        globalCount++;
      })

      // 지갑 주소
      const addressTd = document.createElement("td");
      addressTd.textContent = address;
      addressTd.setAttribute("rowspan", count + "");

      addresses.push(addressTd);
    }

    // 거래일
    const th = document.createElement("th");
    th.textContent = date;
    th.setAttribute("rowspan", globalCount + "");

    dates.push(th);

    const reulst = [dates, addresses, tokens, amounts];
    tableRows.push(reulst);
  })    

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
