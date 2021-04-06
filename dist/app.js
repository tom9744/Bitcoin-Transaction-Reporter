import TransactionReporter from "./utils/transaction.js";
var reporter = TransactionReporter.getInstance("desc");
var generateButton = document.querySelector(".report--button");
var generateReportHandler = function (event) {
    var fromLocalStorage = localStorage.getItem("addressList") || "[]";
    var addressList = JSON.parse(fromLocalStorage);
    reporter.getFullReport(addressList).then(function (report) {
        console.log(report);
    });
};
generateButton.addEventListener("click", generateReportHandler);
//# sourceMappingURL=app.js.map