import TransactionReporter from "./utils/transaction.js";

const reporter = TransactionReporter.getInstance("desc");

const generateButton = document.querySelector(".report--button")! as HTMLButtonElement;

const generateReportHandler = function(event: Event): void {
  const fromLocalStorage = localStorage.getItem("addressList") || "[]"; 
  const addressList = JSON.parse(fromLocalStorage);
  
  reporter.getFullReport(addressList).then(report => {
    console.log(report);
  });
}

generateButton.addEventListener("click", generateReportHandler);
