var ADDRESS_REGEX = /[a-zA-Z0-9]/gi;
var WalletManager = (function () {
    function WalletManager() {
        this.addressList = [];
        this.inputElem = document.querySelector(".wallet--input");
        this.listElem = document.querySelector(".wallet--list");
        this.listTemplate = document.querySelector("#wallet--listitem");
        this.addButtonElem = document.querySelector(".wallet--button__add");
        this.init();
    }
    WalletManager.prototype.init = function () {
        var savedAddressList = localStorage.getItem("addressList") || "[]";
        var parsedAddressList = JSON.parse(savedAddressList);
        for (var _i = 0, parsedAddressList_1 = parsedAddressList; _i < parsedAddressList_1.length; _i++) {
            var address = parsedAddressList_1[_i];
            this.addAddressListItem(address);
        }
        this.addButtonElem.addEventListener("click", this.registerHandler.bind(this));
        this.listElem.addEventListener("click", this.listRemoveHandler.bind(this));
    };
    WalletManager.prototype.addAddressListItem = function (address) {
        var templateContent = this.listTemplate.content;
        var liElem = document.importNode(templateContent, true);
        var paragraphElem = liElem.querySelector("p");
        paragraphElem.textContent = address;
        this.addressList.push(address);
        this.listElem.appendChild(liElem);
    };
    WalletManager.prototype.removeAddressListItem = function (address, targetElem) {
        var targetIndex = this.addressList.findIndex(function (addr) { return addr === address; });
        this.addressList.splice(targetIndex, 1);
        this.listElem.removeChild(targetElem);
    };
    WalletManager.prototype.registerHandler = function (event) {
        event.preventDefault();
        var userInput = this.inputElem.value;
        if (ADDRESS_REGEX.test(userInput)) {
            this.addAddressListItem(userInput);
            localStorage.setItem("addressList", JSON.stringify(this.addressList));
        }
    };
    WalletManager.prototype.listRemoveHandler = function (event) {
        var targetElem = event.target;
        if (targetElem && targetElem.tagName === "BUTTON") {
            var li = targetElem.parentNode;
            var paragraph = Array.from(li.children).find(function (node) { return node.tagName === "P"; });
            var address = paragraph.textContent;
            if (address) {
                this.removeAddressListItem(address, targetElem);
                localStorage.setItem("addressList", JSON.stringify(this.addressList));
            }
        }
    };
    return WalletManager;
}());
export default WalletManager;
//# sourceMappingURL=address.js.map