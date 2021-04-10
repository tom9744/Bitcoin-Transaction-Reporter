import WalletListItem from "./WalletListItem.js";
var WalletList = (function () {
    function WalletList() {
        this.addressList = [];
        this.unorderedList = document.createElement("ul");
        this.unorderedList.classList.add("wallet--list");
        this.unorderedList.addEventListener("click", this.removeHandler.bind(this));
        this.addressList = this.getItemsFromLocalStroage();
    }
    WalletList.prototype.getItemsFromLocalStroage = function () {
        var savedAddressList = localStorage.getItem("addressList") || "[]";
        return JSON.parse(savedAddressList);
    };
    WalletList.prototype.removeHandler = function (event) {
        var targetElem = event.target;
        if (targetElem && targetElem.tagName === "BUTTON") {
            var listItemElem = targetElem.parentElement;
            var paragraphElem = targetElem.previousElementSibling;
            var address = paragraphElem.textContent;
            if (address) {
                this.removeAddress(listItemElem, address);
            }
        }
    };
    WalletList.prototype.removeAddress = function (listItemElem, address) {
        var targetIndex = this.addressList.findIndex(function (addr) { return addr.address === address; });
        this.unorderedList.removeChild(listItemElem);
        this.addressList.splice(targetIndex, 1);
        localStorage.setItem("addressList", JSON.stringify(this.addressList));
    };
    WalletList.prototype.addAddress = function (newListItem) {
        var listItem = new WalletListItem(newListItem);
        var listItemElem = listItem.render();
        this.unorderedList.appendChild(listItemElem);
        this.addressList.push(newListItem);
        localStorage.setItem("addressList", JSON.stringify(this.addressList));
    };
    WalletList.prototype.render = function () {
        var _this = this;
        this.addressList.forEach(function (address) {
            var listItem = new WalletListItem(address);
            var listItemElem = listItem.render();
            _this.unorderedList.appendChild(listItemElem);
        });
        return this.unorderedList;
    };
    return WalletList;
}());
export default WalletList;
//# sourceMappingURL=WalletList.js.map