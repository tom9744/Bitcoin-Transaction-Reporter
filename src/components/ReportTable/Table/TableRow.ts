export default class TableRow {
  /**
   * 인자로 전달된 TableCell을 이용해 새로운 TableRow 태그를 생성한다.
   * @param cellElems TableRow를 구성할 TableCell을 담고 있는 배열
   * @returns 생성된 TableRow 태그
   */
  public generate(cellElems: HTMLTableDataCellElement[]) {
    const tableRowElem = document.createElement("tr");

    cellElems.forEach(elem => {
      tableRowElem.appendChild(elem);
    })

    return tableRowElem;
  }
}