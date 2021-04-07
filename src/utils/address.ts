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
    const parsedAddressList = JSON.parse(savedAddressList);

    for (let address of parsedAddressList) {
      this.addAddressListItem(address);
    }

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

    this.addressList.push(address);
    this.listElem.appendChild(liElem);
  }
  
  private removeAddressListItem(address: string, targetElem: HTMLElement) {
    const targetIndex = this.addressList.findIndex(addr => addr === address);

    this.addressList.splice(targetIndex, 1);

    this.listElem.removeChild(targetElem);
  }

  private registerHandler(event: Event) {
    event.preventDefault();

    const userInput = this.inputElem.value;
  
    if (ADDRESS_REGEX.test(userInput)) {
      this.addAddressListItem(userInput);

      localStorage.setItem("addressList", JSON.stringify(this.addressList));
    }
  }
  
  private listRemoveHandler(event: Event) {
    const targetElem = event.target as HTMLElement;
  
    if (targetElem && targetElem.tagName === "BUTTON") {
      const li = targetElem.parentNode as HTMLLIElement;    
      const paragraph = Array.from(li.children).find(node => node.tagName === "P") as HTMLParagraphElement;
      const address = paragraph.textContent;
  
      if (address) {
        this.removeAddressListItem(address, targetElem);

        localStorage.setItem("addressList", JSON.stringify(this.addressList));
      }
    }
  }
}