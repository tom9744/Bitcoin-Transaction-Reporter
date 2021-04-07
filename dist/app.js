import TransactionReporter from "./utils/transaction.js";
import WalletManager from "./utils/address.js";
new WalletManager();
var reporter = TransactionReporter.getInstance("desc");
var tableBodyElem = document.querySelector("#tbody");
var generateButton = document.querySelector(".report--button");
var makeTable = function (fullReport) {
    var tableRows = [];
    Object.keys(fullReport)
        .sort(function (dateA, dateB) {
        var num1 = +dateA.split("/").join("");
        var num2 = +dateB.split("/").join("");
        return num2 - num1;
    })
        .forEach(function (date, index) {
        var dates = [];
        var addresses = [];
        var tokens = [];
        var amounts = [];
        for (var _i = 0, _a = fullReport[date].reports; _i < _a.length; _i++) {
            var _b = _a[_i], address = _b.address, report = _b.report;
            var count = report.count, changes = report.changes;
            if (count === 0) {
                continue;
            }
            changes.forEach(function (change) {
                var _a = Object.entries(change)[0], tokenSymbol = _a[0], balanceChange = _a[1];
                var tokenTd = document.createElement("td");
                tokenTd.textContent = tokenSymbol;
                tokenTd.classList.add(index % 2 === 0 ? "app-table--body__even" : "app-table--body__odd");
                var amountTd = document.createElement("td");
                amountTd.textContent = balanceChange + "";
                amountTd.classList.add(index % 2 === 0 ? "app-table--body__even" : "app-table--body__odd");
                tokens.push(tokenTd);
                amounts.push(amountTd);
            });
            var addressTd = document.createElement("td");
            addressTd.textContent = address;
            addressTd.setAttribute("rowspan", count + "");
            addressTd.classList.add(index % 2 === 0 ? "app-table--body__even" : "app-table--body__odd");
            addresses.push(addressTd);
        }
        var th = document.createElement("th");
        th.textContent = date;
        th.setAttribute("rowspan", fullReport[date].count + "");
        th.classList.add(index % 2 === 0 ? "app-table--body__even" : "app-table--body__odd");
        dates.push(th);
        tableRows.push([dates, addresses, tokens, amounts]);
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