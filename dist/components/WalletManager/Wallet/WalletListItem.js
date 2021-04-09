var WalletListItem = (function () {
    function WalletListItem(address) {
        this.address = address;
    }
    WalletListItem.prototype.render = function () {
        var walletListItemElem = document.createElement("li");
        walletListItemElem.className = "wallet--listitem";
        walletListItemElem.innerHTML = "\n      <p class=\"wallet--paragraph\">" + this.address + "</p>\n      <button class=\"wallet--button__remove\">\uD835\uDDEB</button>\n    ";
        return walletListItemElem;
    };
    return WalletListItem;
}());
export default WalletListItem;
//# sourceMappingURL=WalletListItem.js.map