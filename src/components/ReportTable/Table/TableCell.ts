export default class TableCell {
  private elementType: "td" | "th";

  constructor(cellType: "td" | "th") {
    this.elementType = cellType;
  }

  /**
   * 인자를 통해 전달된 데이터를 사용해 TableDataCell 또는 TableHeaderCell 태그를 생성한다.
   * @param textContent TextNode에 추가할 문자열
   * @param className CSS 클래스에 추가할 문자열
   * @param attributes HTML 요소에 추가할 Attribute(key, value) 배열
   * @returns 생성된 TableDataCell 또는 TableHeaderCell 태그
   */
  public generate(textContent: string, className?: string, attributes?: Array<{ key: string, value: string }>) {
    const tableDataCellElem = document.createElement(this.elementType);

    if (textContent !== "") {
      tableDataCellElem.textContent = textContent;
    }

    if(className) {
      tableDataCellElem.classList.add(className);
    }

    if(attributes) {
      attributes.forEach(({ key, value }) => {
        tableDataCellElem.setAttribute(key, value);
      });
    }

    return tableDataCellElem;
  }
}