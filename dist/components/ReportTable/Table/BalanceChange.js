var BalanceChange = (function () {
    function BalanceChange() {
    }
    BalanceChange.prototype.generate = function (balanceChange) {
        var paragraph = document.createElement("p");
        if (balanceChange !== 0) {
            balanceChange > 0
                ? paragraph.classList.add("app-table--amount__in")
                : paragraph.classList.add("app-table--amount__out");
            paragraph.textContent = balanceChange.toFixed(12);
        }
        else {
            paragraph.classList.add("app-table--amount");
            paragraph.textContent = balanceChange + "";
        }
        return paragraph;
    };
    return BalanceChange;
}());
export default BalanceChange;
//# sourceMappingURL=BalanceChange.js.map