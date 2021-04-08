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
        var _this = this;
        var savedAddressList = localStorage.getItem("addressList") || "[]";
        var parsedAddressList = JSON.parse(savedAddressList);
        parsedAddressList.forEach(function (address) { _this.addAddressListItem(address); });
        this.addButtonElem.addEventListener("click", this.registerHandler.bind(this));
        this.listElem.addEventListener("click", this.listRemoveHandler.bind(this));
    };
    WalletManager.prototype.addAddressListItem = function (address) {
        var templateContent = this.listTemplate.content;
        var liElem = document.importNode(templateContent, true);
        var paragraphElem = liElem.querySelector("p");
        paragraphElem.textContent = address;
        this.listElem.appendChild(liElem);
    };
    WalletManager.prototype.removeAddressListItem = function (listitemElem) {
        this.listElem.removeChild(listitemElem);
    };
    WalletManager.prototype.registerHandler = function (event) {
        event.preventDefault();
        var newAddress = this.inputElem.value;
        if (ADDRESS_REGEX.test(newAddress)) {
            this.addressList.push(newAddress);
            localStorage.setItem("addressList", JSON.stringify(this.addressList));
            this.addAddressListItem(newAddress);
        }
    };
    WalletManager.prototype.listRemoveHandler = function (event) {
        var targetElem = event.target;
        if (targetElem && targetElem.tagName === "BUTTON") {
            var liElem = targetElem.parentNode;
            var paragraphElem = Array.from(liElem.children).find(function (node) { return node.tagName === "P"; });
            var address_1 = paragraphElem.textContent;
            if (address_1) {
                var targetIndex = this.addressList.findIndex(function (addr) { return addr === address_1; });
                this.addressList.splice(targetIndex, 1);
                localStorage.setItem("addressList", JSON.stringify(this.addressList));
                this.removeAddressListItem(liElem);
            }
        }
    };
    return WalletManager;
}());
export default WalletManager;
//# sourceMappingURL=address.js.map