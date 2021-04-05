import TransactionReporter from "./utils/transaction.js";

const addresses = [
  "0xa75F9C8246f7269279bE4c969e7Bc6Eb619cC204"
]

const finalReport = {};

addresses.forEach(async (address) => {
  {
    const report = await TransactionReporter(address)
  
    Object.keys(report).forEach(date => {
      !finalReport[date]
        ? finalReport[date] = [ { address: address, report: report[date] } ]
        : finalReport[date].push({ address: address, report: report[date] });
    });

    console.log(finalReport);
  }  
})


