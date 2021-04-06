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
        return records.map(function (_a) {
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
            var year = record.parsedDate.getFullYear();
            var month = record.parsedDate.getMonth() + 1;
            var date = record.parsedDate.getDate();
            !acc[year + "/" + month + "/" + date]
                ? acc[year + "/" + month + "/" + date] = [__assign({}, record)]
                : acc[year + "/" + month + "/" + date].push(__assign({}, record));
            return acc;
        }, {});
        return groupedRecords;
    };
    TransactionReporter.prototype.groupByToken = function (records) {
        var groupedRecords = records.reduce(function (acc, record) {
            if (record.tokenSymbol !== "") {
                !acc[record.tokenSymbol]
                    ? acc[record.tokenSymbol] = [record]
                    : acc[record.tokenSymbol].push(record);
            }
            return acc;
        }, {});
        return groupedRecords;
    };
    TransactionReporter.prototype.getReport = function (address) {
        var _this = this;
        return fetch(this.baseUrl + "?module=account&action=tokentx&address=" + address + "&startblock=0&endblock=999999999&sort=" + this.sortingMethod + "&apikey=" + this.apiKey)
            .then(function (response) {
            if (!response.ok) {
                var error = new Error("API 호출에 실패했습니다!");
                throw error;
            }
            return response.json();
        })
            .then(function (_a) {
            var records = _a.result;
            return _this.simplify(records, address);
        })
            .then(function (parsedRecords) { return _this.groupByDate(parsedRecords); })
            .then(function (recordByDate) {
            var recordByDateAndToken = {};
            Object.keys(recordByDate).forEach(function (key) {
                recordByDateAndToken[key] = _this.groupByToken(recordByDate[key]);
            });
            return recordByDateAndToken;
        })
            .then(function (recordByDateAndToken) {
            var balanceChangeByDate = {};
            Object.keys(recordByDateAndToken).forEach(function (date) {
                var balanceChangeByToken = {};
                Object.keys(recordByDateAndToken[date]).forEach(function (token) {
                    balanceChangeByToken[token] = recordByDateAndToken[date][token].reduce(function (acc, _a) {
                        var parsedValue = _a.parsedValue;
                        return acc + parsedValue;
                    }, 0);
                });
                balanceChangeByDate[date] = balanceChangeByToken;
            });
            return balanceChangeByDate;
        })
            .catch(function (error) {
            alert(error);
        });
    };
    return TransactionReporter;
}());
export default TransactionReporter;
//# sourceMappingURL=transaction.js.map