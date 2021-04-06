const ADDRESS_REGEX = /[a-zA-Z0-9]/gi;

const inputElem = document.querySelector(".form--input")! as HTMLInputElement;
const registerButton = document.querySelector(".form--button")! as HTMLFormElement;
const removeButton = document.querySelectorAll(".addr-listitem--button")! as NodeListOf<HTMLButtonElement>;
const listElem = document.querySelector(".addr-list")! as HTMLLIElement;
const liTemplate = document.querySelector("#addr-list-item")! as HTMLTemplateElement;

const init = function () {
  const fromLocalStorage = localStorage.getItem("addressList") || "[]"; 

  addressList = JSON.parse(fromLocalStorage);
  
  for (let address of addressList) {
    addAddressListItem(address);
  }
}

const addAddressListItem = function (address: string) {
  const li = document.importNode(liTemplate.content, true);
  const para = li.querySelector("p")! as HTMLParagraphElement;
  para.textContent = address;
  listElem.appendChild(li);
}

const removeAddressListItem = function (targetElem: HTMLLIElement) {
  listElem.removeChild(targetElem);
}

const registerHandler = function (event: Event) {
  event.preventDefault();

  const userInput = inputElem.value;

  if (ADDRESS_REGEX.test(userInput)) {
    addressList.push(userInput);
    localStorage.setItem("addressList", JSON.stringify(addressList));

    addAddressListItem(userInput);
  }
}

const listRemoveHandler = function (event: Event) {
  const targetElem = event.target as HTMLElement;

  if (targetElem && targetElem.tagName === "BUTTON") {
    const li = targetElem.parentNode as HTMLLIElement;    
    const paragraph = Array.from(li.children).find(node => node.tagName === "P") as HTMLParagraphElement;
    const address = paragraph.textContent;

    if (address) {
      const targetIndex = addressList.findIndex(addr => addr === address);

      addressList.splice(targetIndex, 1);
      localStorage.setItem("addressList", JSON.stringify(addressList));
  
      removeAddressListItem(li);
    }
  }
}

let addressList: string[];

init();

registerButton.addEventListener("click", registerHandler);
listElem.addEventListener("click", listRemoveHandler);