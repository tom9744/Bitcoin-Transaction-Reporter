import App from "../../../App.js";

export default class WalletForm {
  private formElem: HTMLFormElement;

  constructor() {
    this.formElem = document.createElement("form");
    this.formElem.className = "wallet--form";
    this.formElem.innerHTML = `
      <div class="wallet--input-wrapper">
        <label for="address">지갑주소</label>
        <input 
          type="text" 
          id="address" 
          class="wallet--input__address" 
          placeholder="보고서에 등록할 지갑주소" 
        />
      </div>

      <div class="wallet--input-wrapper">
        <label for="alias">별명</label>
        <input 
          type="text" 
          id="alias" 
          class="wallet--input__alias" 
          placeholder="지갑주소를 기억하기 위한 별명" 
        />
      </div>

      <button class="wallet--button__add">지갑주소 추가</button>
    `;

    const buttonElem = this.formElem.querySelector("button")! as HTMLButtonElement;
    buttonElem.addEventListener("click", this.addToList.bind(this));
  }

  private addToList(event: Event) {
    event.preventDefault();

    const addressInputElem = this.formElem.querySelector(".wallet--input__address")! as HTMLInputElement;
    const aliasInputElem = this.formElem.querySelector(".wallet--input__alias")! as HTMLInputElement;

    const newAddr = addressInputElem.value;
    const newAlias = aliasInputElem.value;

    addressInputElem.value = "";
    aliasInputElem.value = "";

    App.addAddress({ address: newAddr, alias: newAlias });
  }

  render() {
    return this.formElem;
  }
}