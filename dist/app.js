import WalletManager from "./components/WalletManager/WalletManager.js";
import ReportMaker from "./components/ReportTable/ReportTable.js";
var App = (function () {
    function App() {
    }
    App.init = function () {
        var wallet = new WalletManager();
        var reportMaker = new ReportMaker();
        wallet.render();
        reportMaker.render();
        this.walletList = wallet.walletList;
    };
    App.addAddress = function (address) {
        this.walletList.addAddress(address);
    };
    return App;
}());
export default App;
App.init();
//# sourceMappingURL=app.js.map