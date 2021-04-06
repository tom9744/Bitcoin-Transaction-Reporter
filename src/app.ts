import TransactionReporter from "./utils/transaction.js";

type Report = {
  [prop: string]: number 
};

async function makeFullReport(addresses: string[]) {
  console.log("[SYSTEM] Started Loading Transaction Data...ts");
  

  const startTime = new Date().getTime();
  const fullReport: {
    [prop: string]: Array<{ address: string, report: Report }>
  } = {};

  // 순차적 비동기 처리
  for (const address of addresses) {
    const reporter = TransactionReporter.getInstance("desc");
    const report = await reporter.getReport(address);

    if (!report) { continue }
    
    Object.keys(report).forEach(date => {
      !fullReport[date]
        ? fullReport[date] = [ { address: address, report: report[date] } ]
        : fullReport[date].push({ address: address, report: report[date] });
    });
  }
  const endTime = new Date().getTime();

  console.log(fullReport);
  console.log(`총 수행시간: ${endTime - startTime}ms`);
}

const addresses = [
  "0xa75F9C8246f7269279bE4c969e7Bc6Eb619cC204",
  "0xc03845b1C9b43EE10393a9Cf5F05548922D3C282",
  "0x0e99489cbA652a55B729516F53721FEFAE62EEd4",
  "0x58aa8D64654e1A2D47f570A5Ade8233A300849B5"
]

makeFullReport(addresses);

