export function parseValue(value, tokenDecimal) {
  const valueArr = value.split("");

  if (valueArr.length === tokenDecimal) {
    valueArr.splice(0, 0, "0", ".");
  }
  else {
    valueArr.splice(valueArr.length - tokenDecimal, 0, ".");
  }
  
  return parseFloat(valueArr.join(""));
}

export function parseDate(date) {
  return new Date(date * 1000);
}

