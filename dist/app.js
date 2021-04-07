import TransactionReporter from "./utils/transaction.js";
import WalletManager from "./utils/address.js";
new WalletManager();
var reporter = TransactionReporter.getInstance("desc");
var tableBodyElem = document.querySelector("#tbody");
var generateButton = document.querySelector(".report--button");
var makeTable = function (fullReport) {
    console.log(fullReport);
    var tableRows = [];
    Object.keys(fullReport).forEach(function (date) {
        var dates = [];
        var addresses = [];
        var tokens = [];
        var amounts = [];
        var globalCount = 0;
        for (var _i = 0, _a = fullReport[date]; _i < _a.length; _i++) {
            var _b = _a[_i], address = _b.address, report = _b.report;
            var count = report.count, changes = report.changes;
            if (count === 0) {
                continue;
            }
            changes.forEach(function (change) {
                var _a = Object.entries(change)[0], tokenSymbol = _a[0], balanceChange = _a[1];
                var tokenTd = document.createElement("td");
                tokenTd.textContent = tokenSymbol;
                var amountTd = document.createElement("td");
                amountTd.textContent = balanceChange + "";
                tokens.push(tokenTd);
                amounts.push(amountTd);
                globalCount++;
            });
            var addressTd = document.createElement("td");
            addressTd.textContent = address;
            addressTd.setAttribute("rowspan", count + "");
            addresses.push(addressTd);
        }
        var th = document.createElement("th");
        th.textContent = date;
        th.setAttribute("rowspan", globalCount + "");
        dates.push(th);
        var reulst = [dates, addresses, tokens, amounts];
        tableRows.push(reulst);
    });
    return tableRows;
};
var generateReportHandler = function () {
    var fromLocalStorage = localStorage.getItem("addressList") || "[]";
    var addressList = JSON.parse(fromLocalStorage);
    reporter.getFullReport(addressList).then(function (fullReport) {
        var rows = makeTable(fullReport);
        rows.forEach(function (_a) {
            var th = _a[0], addrs = _a[1], token = _a[2], amount = _a[3];
            var chunkLength = [];
            addrs.forEach(function (addr) {
                chunkLength.push(+addr.getAttribute("rowspan"));
            });
            var count = 0;
            var chunkNumber = 0;
            token.forEach(function (each, index) {
                var tr = document.createElement("tr");
                if (index === 0) {
                    var tableHead = th[0];
                    tr.appendChild(tableHead);
                }
                if (count === 0) {
                    tr.appendChild(addrs[chunkNumber]);
                }
                tr.appendChild(each);
                tr.appendChild(amount[index]);
                tableBodyElem.appendChild(tr);
                count++;
                if (count === chunkLength[chunkNumber]) {
                    count = 0;
                    chunkNumber++;
                }
            });
        });
    });
};
generateButton.addEventListener("click", generateReportHandler);
//# sourceMappingURL=app.js.map