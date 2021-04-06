export function parseValue(value, tokenDecimal) {
    var valueArr = value.split("");
    var decimalLength = Number(tokenDecimal);
    var decimalPointIndex = valueArr.length - decimalLength;
    valueArr.length === decimalLength
        ? valueArr.splice(0, 0, "0", ".")
        : valueArr.splice(decimalPointIndex, 0, ".");
    return parseFloat(valueArr.join(""));
}
export function parseDate(timeStamp) {
    return new Date(Number(timeStamp) * 1000);
}
//# sourceMappingURL=parser.js.map