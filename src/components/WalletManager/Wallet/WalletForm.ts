import App from "../../../App.js";

export default class WalletForm {
  private formElem: HTMLFormElement;

  constructor() {
    this.formElem = document.createElement("form");
    this.formElem.className = "wallet--form";
    this.formElem.innerHTML = `
      <input class="wallet--input" type="text" />
      <button class="wallet--button__add">등록</button>
    `;

    const buttonElem = this.formElem.querySelector("button")! as HTMLButtonElement;
    buttonElem.addEventListener("click", this.addToList.bind(this));
  }

  private addToList(event: Event) {
    event.preventDefault();

    const inputElem = this.formElem.querySelector("input")!;
    const newAddr = inputElem.value;

    inputElem.value = "";

    App.addAddress(newAddr);
  }

  render() {
    return this.formElem;
  }
}