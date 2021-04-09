var TableRow = (function () {
    function TableRow() {
    }
    TableRow.prototype.generate = function (cellElems) {
        var tableRowElem = document.createElement("tr");
        cellElems.forEach(function (elem) {
            tableRowElem.appendChild(elem);
        });
        return tableRowElem;
    };
    return TableRow;
}());
export default TableRow;
//# sourceMappingURL=TableRow.js.map