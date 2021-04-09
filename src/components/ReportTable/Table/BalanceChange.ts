export default class BalanceChange {
  /**
   * 최종 거래량의 양수, 음수 여부에 따라 별도의 클래스를 추가한 Paragraph 태그를 생성한다.
   * @param {number} balanceChange 일별 최종 거래량
   * @returns 생성된 Paragraph 태그
   */
  public generate(balanceChange: number) {
    const paragraph = document.createElement("p");

    if (balanceChange !== 0) {
      balanceChange > 0 
        ? paragraph.classList.add("app-table--amount__in")
        : paragraph.classList.add("app-table--amount__out");

      paragraph.textContent = balanceChange.toFixed(12);
    } else {
      paragraph.classList.add("app-table--amount");

      paragraph.textContent = balanceChange + "";
    }

    return paragraph;
  }
}
