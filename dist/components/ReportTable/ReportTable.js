var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import TransactionReporter from "../../utils/Transaction.js";
import TableCell from "./Table/TableCell.js";
import TableRow from "./Table/TableRow.js";
import BalanceChange from "./Table/BalanceChange.js";
var ReportMaker = (function () {
    function ReportMaker() {
        this.tableDataCell = new TableCell("td");
        this.tableHeaderCell = new TableCell("th");
        this.tableRowCell = new TableRow();
        this.paragraph = new BalanceChange();
        this.tableRows = [];
        this.reportSection = document.querySelector(".report");
        this.reportSection.innerHTML = "\n      <button class=\"report--button__abled\">\uBCF4\uACE0\uC11C \uBC1B\uAE30</button>\n\n      <em class=\"report--notice\">\uC0C8\uB85C\uACE0\uCE68 \uD558\uC2DC\uBA74 \uBCF4\uACE0\uC11C\uAC00 \uCD08\uAE30\uD654\uB429\uB2C8\uB2E4...!</em>\n\n      <table\n        class=\"app-table\"\n        width=\"50%\"\n        height=\"200\"\n        cellspacing=\"5\"\n        border=\"1\"\n      >\n        <thead>\n            <tr align=\"center\">\n                <th class=\"app-table--head\" style=\"width:10%\">\uB0A0\uC9DC</th>\n                <th class=\"app-table--head\" style=\"width:40%\">\uC9C0\uAC11</th>\n                <th class=\"app-table--head\" style=\"width:29%\">\uCF54\uC778</th>\n                <th class=\"app-table--head\" style=\"width:10%\">\uAC70\uB798 \uD615\uD0DC</th>\n                <th class=\"app-table--head\" style=\"width:20%\">\uAC70\uB798\uB7C9</th>\n            </tr>\n        </thead>\n\n        <tbody id=\"tbody\" class=\"table--body\">\n        </tbody>\n      </table>\n    ";
        var reportGenerateButton = this.reportSection.querySelector(".report--button__abled");
        reportGenerateButton.addEventListener("click", this.generateReportHandler.bind(this));
    }
    ReportMaker.prototype.generateReport = function (fullReport) {
        var _this = this;
        Object.keys(fullReport)
            .sort(function (dateA, dateB) {
            var num1 = +dateA.split("/").join("");
            var num2 = +dateB.split("/").join("");
            return num2 - num1;
        })
            .forEach(function (date, index) {
            var tableClassName = index % 2 === 0
                ? "app-table--body__even"
                : "app-table--body__odd";
            var tableAttrs = [{ key: "rowspan", value: fullReport[date].count + "" }];
            var dateTableCellElem = _this.tableHeaderCell.generate(date, [tableClassName], tableAttrs);
            fullReport[date].reports.forEach(function (_a, addressIndex) {
                var address = _a.address, report = _a.report;
                var count = report.count, changes = report.changes;
                if (count !== 0) {
                    var tableAttrs_1 = [{ key: "rowspan", value: count + "" }];
                    var addressTableCellElem_1 = _this.tableDataCell.generate(address, [tableClassName], tableAttrs_1);
                    changes.forEach(function (change, changeIndex) {
                        var _a = Object.entries(change)[0], tokenSymbol = _a[0], balanceChange = _a[1];
                        var cells = [];
                        var tokenTableCellElem = _this.tableDataCell.generate(tokenSymbol, [tableClassName]);
                        var directionTableCellElem = _this.tableDataCell.generate("", [tableClassName]);
                        var flag = document.createElement("p");
                        flag.textContent = balanceChange > 0 ? "IN" : (balanceChange < 0 ? "OUT" : "-");
                        flag.className = balanceChange > 0
                            ? "app-table--flag__in"
                            : balanceChange < 0
                                ? "app-table--flag__out"
                                : "app-table--flag";
                        directionTableCellElem.appendChild(flag);
                        var paragraphElem = _this.paragraph.generate(balanceChange);
                        var amountTableCellElem = _this.tableDataCell.generate("", [tableClassName]);
                        amountTableCellElem.appendChild(paragraphElem);
                        if (changeIndex === 0) {
                            if (addressIndex === 0) {
                                cells.push(dateTableCellElem);
                            }
                            cells.push(addressTableCellElem_1);
                        }
                        cells.push(tokenTableCellElem);
                        cells.push(directionTableCellElem);
                        cells.push(amountTableCellElem);
                        var tableRowElem = _this.tableRowCell.generate(cells);
                        _this.tableRows.push(tableRowElem);
                    });
                }
            });
        });
    };
    ReportMaker.prototype.generateReportHandler = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reportGenerateButton, reporter, fromLocalStorage, addressList, fullReport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportGenerateButton = this.reportSection.querySelector(".report--button__abled");
                        reportGenerateButton.className = "report--button__disabled";
                        reporter = TransactionReporter.getInstance("desc");
                        fromLocalStorage = localStorage.getItem("addressList") || "[]";
                        addressList = JSON.parse(fromLocalStorage);
                        return [4, reporter.getFullReport(addressList)];
                    case 1:
                        fullReport = _a.sent();
                        this.generateReport(fullReport);
                        this.render();
                        reportGenerateButton.className = "report--button__abled";
                        return [2];
                }
            });
        });
    };
    ReportMaker.prototype.render = function () {
        var tableBody = this.reportSection.querySelector(".table--body");
        this.tableRows.forEach(function (tableRow) {
            tableBody.appendChild(tableRow);
        });
    };
    return ReportMaker;
}());
export default ReportMaker;
//# sourceMappingURL=ReportTable.js.map