import { parseValue, parseDate } from "./parser.js";

/**
 * 원본 JSON 객체에서 필요한 속성만 선택하여, 새로운 객체를 만들어 반환한다.
 * @param {Object} records 
 * @returns 
 */
export function _simplify(records, walletAddress) {
  return records.map(({ value, tokenDecimal, tokenName, tokenSymbol, from, timeStamp }) => {
    const parsedDate = parseDate(timeStamp);
    const parsedValue = walletAddress.toUpperCase() === from.toUpperCase() 
      ? -parseValue(value, Number(tokenDecimal)) 
      : parseValue(value, Number(tokenDecimal));

    return { parsedValue, tokenName, tokenSymbol, parsedDate };
  });
}

/**
 * 주어진 Records를 Date 별로 묶어, 객체 형태로 반환한다.
 * @param {Object} records 
 * @returns 
 */
 export function _groupByDate(records) {
  return records.reduce((acc, curr) => {
    const year = curr.parsedDate.getFullYear();
    const month = curr.parsedDate.getMonth() + 1;
    const date = curr.parsedDate.getDate();
    
    !acc[`${year}/${month}/${date}`] 
      ? acc[`${year}/${month}/${date}`] = [{ ...curr }]
      : acc[`${year}/${month}/${date}`].push({  ...curr });

    return acc;
  }, {});
}

/**
 * 주어진 Records를 Token 별로 묶어, 객체 형태로 반환한다.
 * @param {Object} records 
 * @returns 
 */
export function _groupByToken(records) {
  return records.reduce((acc, curr) => {
    if(curr.tokenSymbol === "") {
      return acc;
    }

    !acc[curr.tokenSymbol] 
      ? acc[curr.tokenSymbol] = [curr]
      : acc[curr.tokenSymbol].push(curr);

    return acc;
  }, {});
}

export default function (address) {
  // Closures
  const BASE_URL = "https://api.etherscan.io/api";
  const API_KEY = "12ZSBIZUKUNEX6IEZWMBQ1TCFT3PPMV9RE";
  const SORT_FLAG = "desc";

  return fetch(`${BASE_URL}?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=${SORT_FLAG}&apikey=${API_KEY}`)
  .then(res => {
    if (!res.ok) {
      const error = new Error("API 호출에 실패했습니다!");
      throw error;
    }
    return res.json();
  })
  .then(({ result: records }) => _simplify(records, address))
  .then(parsedRecords => _groupByDate(parsedRecords))
  .then(recordByDate => {
    // key는 YYYY/MM/DD 형태의 문자열.
    Object.keys(recordByDate).forEach(key => {
      recordByDate[key] = _groupByToken(recordByDate[key]);
    });
    return recordByDate;
  })
  .then(recordByDateAndToken => {
    Object.keys(recordByDateAndToken).forEach(date => {
      const tempRecord = recordByDateAndToken[date];

      Object.keys(tempRecord).forEach(token => {
        tempRecord[token] = tempRecord[token].reduce((acc, { parsedValue }) => acc + parsedValue, 0);
      });

      recordByDateAndToken[date] = tempRecord;
    })

    return recordByDateAndToken;
  })
  .catch(error => {
    alert(error);
  });
}