var BalanceChange = (function () {
    function BalanceChange() {
    }
    BalanceChange.prototype.generate = function (balanceChange) {
        var divElem = document.createElement("div");
        divElem.className = "app-table--transaction-cell";
        var flag = document.createElement("p");
        var paragraph = document.createElement("p");
        if (balanceChange !== 0) {
            flag.textContent = balanceChange > 0 ? "IN" : "OUT";
            flag.className = balanceChange > 0
                ? "app-table--flag__in"
                : "app-table--flag__out";
            balanceChange > 0
                ? paragraph.classList.add("app-table--amount__in")
                : paragraph.classList.add("app-table--amount__out");
            paragraph.textContent = balanceChange.toFixed(12);
        }
        else {
            paragraph.classList.add("app-table--amount");
            paragraph.textContent = balanceChange + "";
        }
        divElem.appendChild(flag);
        divElem.appendChild(paragraph);
        return divElem;
    };
    return BalanceChange;
}());
export default BalanceChange;
//# sourceMappingURL=BalanceChange.js.map