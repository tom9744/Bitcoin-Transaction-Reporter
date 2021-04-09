import WalletListItem from "./WalletListItem.js";

export default class WalletList {
  private unorderedList: HTMLUListElement;
  private addressList: string[] = [];

  constructor () {
    this.unorderedList = document.createElement("ul");
    this.unorderedList.classList.add("wallet--list");
    this.unorderedList.addEventListener("click", this.removeHandler.bind(this));
    this.addressList = this.getItemsFromLocalStroage();
  }

  private getItemsFromLocalStroage() {
    const savedAddressList = localStorage.getItem("addressList") || "[]";

    return JSON.parse(savedAddressList) as string[]; // Javascript 배열로 변환. 
  }

  private removeHandler(event: Event) {
    // TODO: 문제가 될 수 있는 요소가 있으므로 개선해야 한다.
    const targetElem = event.target as HTMLElement;
  
    if (targetElem && targetElem.tagName === "BUTTON") {
      const listItemElem = targetElem.parentElement! as HTMLLIElement;
      const paragraphElem = targetElem.previousElementSibling! as HTMLParagraphElement;
      const address = paragraphElem.textContent;

      if (address) {
        this.removeAddress(listItemElem, address);
      }
    }
  }

  private removeAddress(listItemElem: HTMLLIElement, address: string) {
    const targetIndex = this.addressList.findIndex(addr => addr === address);
    this.unorderedList.removeChild(listItemElem);

    this.addressList.splice(targetIndex, 1);
    localStorage.setItem("addressList", JSON.stringify(this.addressList));
  }

  public addAddress(address: string) {
    const listItem = new WalletListItem(address);
    const listItemElem = listItem.render();
    this.unorderedList.appendChild(listItemElem);

    this.addressList.push(address);
    localStorage.setItem("addressList", JSON.stringify(this.addressList));
  }

  public render() {
    this.addressList.forEach(address => {
      const listItem = new WalletListItem(address);
      const listItemElem = listItem.render();
      this.unorderedList.appendChild(listItemElem);
    })
    
    return this.unorderedList;
  }
}