const ADDRESS_REGEX = /[a-zA-Z0-9]/gi;

export default class WalletManager {
  private inputElem: HTMLInputElement;
  private listElem: HTMLLIElement;
  private listTemplate: HTMLTemplateElement;
  private addButtonElem: HTMLButtonElement;

  private addressList: string[] = [];

  constructor () {
    this.inputElem = document.querySelector(".wallet--input")! as HTMLInputElement;
    this.listElem = document.querySelector(".wallet--list")! as HTMLLIElement;
    this.listTemplate = document.querySelector("#wallet--listitem")! as HTMLTemplateElement;
    this.addButtonElem = document.querySelector(".wallet--button__add")! as HTMLButtonElement;

    this.init();
  }

  /**
   * LocalStorage에 저장된 지갑주소를 불러와 화면에 렌더링하고, 필요한 이벤트 리스너를 등록한다.
   */
  private init() {
    const savedAddressList = localStorage.getItem("addressList") || "[]";
    const parsedAddressList = JSON.parse(savedAddressList) as string[]; // Javascript 배열로 변환. 

    parsedAddressList.forEach(address => { this.addAddressListItem(address); });

    this.addButtonElem.addEventListener("click", this.registerHandler.bind(this));
    this.listElem.addEventListener("click", this.listRemoveHandler.bind(this));
  }

  /**
   * 인자로 전달받은 지갑주소를 기반으로 <li> 태그를 생성하고, <ul> 태그에 추가한다.
   * @param address 지갑주소
   */
  private addAddressListItem(address: string) {
    const templateContent = this.listTemplate.content;
    const liElem = document.importNode(templateContent, true);
    const paragraphElem = liElem.querySelector("p")! as HTMLParagraphElement;
    paragraphElem.textContent = address;

    this.listElem.appendChild(liElem);
  }
  
  /**
   * 인자로 전달받은 <li> 태그를 <ul>에서 제거한다. 
   * @param listitemElem 삭제할 <li> 태그에 대한 DOM 객체
   */
  private removeAddressListItem(listitemElem: HTMLLIElement) {
    this.listElem.removeChild(listitemElem);
  }

  private registerHandler(event: Event) {
    event.preventDefault();

    const newAddress = this.inputElem.value;
  
    if (ADDRESS_REGEX.test(newAddress)) {
      this.addressList.push(newAddress);

      localStorage.setItem("addressList", JSON.stringify(this.addressList));

      this.addAddressListItem(newAddress);
    }
  }
  
  private listRemoveHandler(event: Event) {
    // TODO: 문제가 될 수 있는 요소가 있으므로 개선해야 한다.
    const targetElem = event.target as HTMLElement;
  
    if (targetElem && targetElem.tagName === "BUTTON") {
      const liElem = targetElem.parentNode as HTMLLIElement;   
      const paragraphElem = Array.from(liElem.children).find(node => node.tagName === "P") as HTMLParagraphElement;
      const address = paragraphElem.textContent;
  
      if (address) {
        const targetIndex = this.addressList.findIndex(addr => addr === address);

        this.addressList.splice(targetIndex, 1);

        localStorage.setItem("addressList", JSON.stringify(this.addressList));

        this.removeAddressListItem(liElem);
      }
    }
  }
}