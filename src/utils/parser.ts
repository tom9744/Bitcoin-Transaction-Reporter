export function parseValue(value: string, tokenDecimal: string): number {
  const valueArr = value.split("");
  const decimalLength = Number(tokenDecimal);
  const decimalPointIndex = valueArr.length - decimalLength;

  // 실수 값이 0인 경우 맨 앞에 "0."을 추가하고, 그렇지 않은 경우 "."만 추가한다. 
  valueArr.length === decimalLength
    ? valueArr.splice(0, 0, "0", ".")
    : valueArr.splice(decimalPointIndex, 0, ".");

  return parseFloat(valueArr.join(""));
}

export function parseDate(timeStamp: string) {
  // Etherscan 시스템의 timeStamp는 초단위이기 때문에, ms 단위로 변환한다.
  return new Date(Number(timeStamp) * 1000);
}

