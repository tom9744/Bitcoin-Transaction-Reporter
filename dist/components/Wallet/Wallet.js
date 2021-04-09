import WalletList from "./WalletList.js";
import WalletForm from "./WalletForm.js";
var Wallet = (function () {
    function Wallet() {
        this.walletList = new WalletList();
        this.walletForm = new WalletForm();
    }
    Wallet.prototype.render = function () {
        var walletSection = document.querySelector(".wallet");
        var walletFormElem = this.walletForm.render();
        var walletListElem = this.walletList.render();
        walletSection.appendChild(walletFormElem);
        walletSection.appendChild(walletListElem);
    };
    return Wallet;
}());
export default Wallet;
//# sourceMappingURL=Wallet.js.map