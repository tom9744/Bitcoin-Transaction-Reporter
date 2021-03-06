var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { parseValue, parseDate } from "./parser.js";
var TransactionReporter = (function () {
    function TransactionReporter(sortingMethod) {
        this.baseUrl = "https://api.etherscan.io/api";
        this.apiKey = "12ZSBIZUKUNEX6IEZWMBQ1TCFT3PPMV9RE";
        this.sortingMethod = sortingMethod;
    }
    TransactionReporter.getInstance = function (sortingMethod) {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new TransactionReporter(sortingMethod);
        return this.instance;
    };
    TransactionReporter.prototype.simplify = function (records, walletAddress) {
        return records
            .filter(function (_a) {
            var timeStamp = _a.timeStamp;
            var timeGap = new Date().getTime() - +timeStamp * 1000;
            var daysPassed = timeGap / 1000 / 60 / 60 / 24;
            return daysPassed < 90;
        })
            .map(function (_a) {
            var value = _a.value, tokenDecimal = _a.tokenDecimal, tokenSymbol = _a.tokenSymbol, from = _a.from, timeStamp = _a.timeStamp;
            var parsedDate = parseDate(timeStamp);
            var parsedValue = walletAddress.toUpperCase() === from.toUpperCase()
                ? -parseValue(value, tokenDecimal)
                : parseValue(value, tokenDecimal);
            return { parsedValue: parsedValue, tokenSymbol: tokenSymbol, parsedDate: parsedDate };
        });
    };
    TransactionReporter.prototype.groupByDate = function (records) {
        var groupedRecords = records.reduce(function (acc, record) {
            var parsedDate = record.parsedDate;
            var year = parsedDate.getFullYear();
            var month = parsedDate.getMonth() + 1;
            var date = parsedDate.getDate();
            var yearMonthDate = year + "/" + (month < 10 ? "0" + month : month) + "/" + (date < 10 ? "0" + date : date);
            !acc[yearMonthDate]
                ? acc[yearMonthDate] = [__assign({}, record)]
                : acc[yearMonthDate].push(__assign({}, record));
            return acc;
        }, {});
        return groupedRecords;
    };
    TransactionReporter.prototype.groupByToken = function (records) {
        var groupedRecords = records.reduce(function (acc, record) {
            var tokenSymbol = record.tokenSymbol;
            tokenSymbol !== "" && !acc[tokenSymbol]
                ? acc[tokenSymbol] = [record]
                : acc[tokenSymbol].push(record);
            return acc;
        }, {});
        return groupedRecords;
    };
    TransactionReporter.prototype.getDailySummary = function (transactionPerToken) {
        var transferPerToken = {
            count: Object.keys(transactionPerToken).length,
            changes: []
        };
        Object.keys(transactionPerToken).forEach(function (token) {
            var _a;
            var summary = transactionPerToken[token].reduce(function (acc, _a) {
                var parsedValue = _a.parsedValue;
                return acc + parsedValue;
            }, 0);
            transferPerToken.changes.push((_a = {}, _a[token] = summary, _a));
        });
        return transferPerToken;
    };
    TransactionReporter.prototype.getSingleAddressReport = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error, result, simplifiedDate, groupedByDate_1, groupedByDateAndToken_1, singleAddressReport_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, fetch(this.baseUrl + "?module=account&action=tokentx&address=" + address + "&startblock=0&endblock=999999999&sort=" + this.sortingMethod + "&apikey=" + this.apiKey)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            error = new Error("API ????????? ??????????????????!");
                            throw error;
                        }
                        return [4, response.json()];
                    case 2:
                        result = (_a.sent()).result;
                        simplifiedDate = this.simplify(result, address);
                        groupedByDate_1 = this.groupByDate(simplifiedDate);
                        groupedByDateAndToken_1 = {};
                        Object.keys(groupedByDate_1).forEach(function (date) {
                            groupedByDateAndToken_1[date] = _this.groupByToken(groupedByDate_1[date]);
                        });
                        singleAddressReport_1 = {};
                        Object.keys(groupedByDateAndToken_1).forEach(function (date) {
                            singleAddressReport_1[date] = _this.getDailySummary(groupedByDateAndToken_1[date]);
                        });
                        return [2, singleAddressReport_1];
                    case 3:
                        error_1 = _a.sent();
                        alert(error_1.message);
                        return [2];
                    case 4: return [2];
                }
            });
        });
    };
    TransactionReporter.prototype.getFullReport = function (addresses) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, fullReport, _loop_1, this_1, _i, addresses_1, _a, address, alias, endTime;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        startTime = new Date().getTime();
                        console.log("[SYSTEM] Started Loading Transaction Data...");
                        fullReport = {};
                        _loop_1 = function (address, alias) {
                            var report;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4, this_1.getSingleAddressReport(address)];
                                    case 1:
                                        report = _c.sent();
                                        if (!report) {
                                            return [2, "continue"];
                                        }
                                        Object.keys(report).forEach(function (date) {
                                            if (!fullReport[date]) {
                                                fullReport[date] = {
                                                    count: report[date].count,
                                                    reports: [{ address: address, alias: alias, report: report[date] }]
                                                };
                                            }
                                            else {
                                                fullReport[date].count += report[date].count;
                                                fullReport[date].reports.push({ address: address, alias: alias, report: report[date] });
                                            }
                                        });
                                        return [2];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, addresses_1 = addresses;
                        _b.label = 1;
                    case 1:
                        if (!(_i < addresses_1.length)) return [3, 4];
                        _a = addresses_1[_i], address = _a.address, alias = _a.alias;
                        return [5, _loop_1(address, alias)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4:
                        endTime = new Date().getTime();
                        console.log("\uCD1D \uC218\uD589\uC2DC\uAC04: " + (endTime - startTime) + "ms");
                        return [2, fullReport];
                }
            });
        });
    };
    return TransactionReporter;
}());
export default TransactionReporter;
//# sourceMappingURL=Transaction.js.map