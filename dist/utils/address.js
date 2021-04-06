"use strict";
var ADDRESS_REGEX = /[a-zA-Z0-9]/gi;
var inputElem = document.querySelector(".wallet--input");
var registerButton = document.querySelector(".wallet--button__add");
var removeButton = document.querySelectorAll(".wallet--button__remove");
var listElem = document.querySelector(".wallet--list");
var liTemplate = document.querySelector("#wallet--listitem");
var init = function () {
    var fromLocalStorage = localStorage.getItem("addressList") || "[]";
    addressList = JSON.parse(fromLocalStorage);
    for (var _i = 0, addressList_1 = addressList; _i < addressList_1.length; _i++) {
        var address = addressList_1[_i];
        addAddressListItem(address);
    }
};
var addAddressListItem = function (address) {
    var li = document.importNode(liTemplate.content, true);
    var para = li.querySelector("p");
    para.textContent = address;
    listElem.appendChild(li);
};
var removeAddressListItem = function (targetElem) {
    listElem.removeChild(targetElem);
};
var registerHandler = function (event) {
    event.preventDefault();
    var userInput = inputElem.value;
    if (ADDRESS_REGEX.test(userInput)) {
        addressList.push(userInput);
        localStorage.setItem("addressList", JSON.stringify(addressList));
        addAddressListItem(userInput);
    }
};
var listRemoveHandler = function (event) {
    var targetElem = event.target;
    if (targetElem && targetElem.tagName === "BUTTON") {
        var li = targetElem.parentNode;
        var paragraph = Array.from(li.children).find(function (node) { return node.tagName === "P"; });
        var address_1 = paragraph.textContent;
        if (address_1) {
            var targetIndex = addressList.findIndex(function (addr) { return addr === address_1; });
            addressList.splice(targetIndex, 1);
            localStorage.setItem("addressList", JSON.stringify(addressList));
            removeAddressListItem(li);
        }
    }
};
var addressList;
init();
registerButton.addEventListener("click", registerHandler);
listElem.addEventListener("click", listRemoveHandler);
//# sourceMappingURL=address.js.map