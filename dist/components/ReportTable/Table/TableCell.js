var TableCell = (function () {
    function TableCell(cellType) {
        this.elementType = cellType;
    }
    TableCell.prototype.generate = function (textContent, classNames, attributes) {
        var tableDataCellElem = document.createElement(this.elementType);
        if (textContent !== "") {
            tableDataCellElem.textContent = textContent;
        }
        if (classNames) {
            classNames.forEach(function (className) {
                tableDataCellElem.classList.add(className);
            });
        }
        if (attributes) {
            attributes.forEach(function (_a) {
                var key = _a.key, value = _a.value;
                tableDataCellElem.setAttribute(key, value);
            });
        }
        return tableDataCellElem;
    };
    return TableCell;
}());
export default TableCell;
//# sourceMappingURL=TableCell.js.map