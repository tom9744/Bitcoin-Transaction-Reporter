var BalanceChange = (function () {
    function BalanceChange() {
    }
    BalanceChange.prototype.generate = function (balanceChange) {
        var paragraph = document.createElement("p");
        paragraph.textContent = balanceChange + "";
        paragraph.classList.add(balanceChange > 0
            ? "app-table--transaction__in"
            : balanceChange < 0
                ? "app-table--transaction__out"
                : "app-table--transaction");
        return paragraph;
    };
    return BalanceChange;
}());
export default BalanceChange;
//# sourceMappingURL=BalanceChange.js.map