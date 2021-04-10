var WalletListItem = (function () {
    function WalletListItem(address) {
        this.address = address;
    }
    WalletListItem.prototype.render = function () {
        var walletListItemElem = document.createElement("li");
        walletListItemElem.className = "wallet--listitem";
        walletListItemElem.innerHTML = "\n      <div class=\"wallet--info\">\n        <p class=\"wallet--paragraph__alias\">" + this.address.alias + "</p>\n        <p class=\"wallet--paragraph__address\">" + this.address.address + "</p>\n      </div>\n\n      <button class=\"wallet--button__remove\">\uD835\uDDEB</button>\n    ";
        return walletListItemElem;
    };
    return WalletListItem;
}());
export default WalletListItem;
//# sourceMappingURL=WalletListItem.js.map