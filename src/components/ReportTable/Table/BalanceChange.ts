export default class BalanceChange {
  /**
   * 최종 거래량의 양수, 음수 여부에 따라 별도의 클래스를 추가한 Paragraph 태그를 생성한다.
   * @param {number} balanceChange 일별 최종 거래량
   * @returns 생성된 Paragraph 태그
   */
  public generate(balanceChange: number) {
    const paragraph = document.createElement("p");
    
    paragraph.textContent = balanceChange + "";
    paragraph.classList.add(
      balanceChange > 0 
      ? "app-table--transaction__in" 
      : balanceChange < 0 
        ? "app-table--transaction__out" 
        : "app-table--transaction"
    );

    return paragraph;
  }
}
