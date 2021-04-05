const ADDRESS_REGEX = /[a-zA-Z0-9]/gi;

const inputElem = document.querySelector(".form--input");
const registerButton = document.querySelector(".form--button");
const removeButton = document.querySelectorAll(".addr-listitem--button");
const listElem = document.querySelector(".addr-list");
const liTemplate = document.querySelector("#addr-list-item");

const addAddressListItem = function (address) {
  const li = document.importNode(liTemplate.content, true);
  const para = li.querySelector("p");
  para.textContent = address;
  listElem.appendChild(li);
}

const removeAddressListItem = function (address) {
  const target = [...listElem.children].find(each => {
    return [...each.children][0].textContent === address;
  });

  listElem.removeChild(target);
}

let addressList = localStorage.getItem("addressList") || new Array();

const init = function () {
  addressList = Array.isArray(addressList) 
    ? addressList
    : JSON.parse(addressList);
  
  for (let address of addressList) {
    addAddressListItem(address);
  }
}

init();

const registerHandler = function (event) {
  event.preventDefault();

  const userInput = inputElem.value;

  if (ADDRESS_REGEX.test(userInput)) {
    addAddressListItem(userInput);

    addressList.push(userInput);
    localStorage.setItem("addressList", JSON.stringify(addressList));
  }
}

const removeHandler = function ({ target }) {
  if (target.tagName === "BUTTON") {
    const li = target.parentNode.childNodes;

    const paragraph = Array.from(li).filter((node) => {
      return node.tagName === "P"
    }).pop();

    const address = paragraph.textContent;

    removeAddressListItem(address);

    const index = addressList.findIndex(addr => addr === address);

    addressList.splice(index, 1);
    localStorage.setItem("addressList", JSON.stringify(addressList));
  }
}

registerButton.addEventListener("click", registerHandler);
listElem.addEventListener("click", removeHandler);