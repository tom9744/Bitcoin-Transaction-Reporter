import WalletManager from "./components/WalletManager/WalletManager.js";
import WalletList from "./components/WalletManager/Wallet/WalletList.js";
import ReportMaker from "./components/ReportTable/ReportTable.js";

export default class App {
  static walletList: WalletList;

  static init() {
    const wallet = new WalletManager();
    const reportMaker = new ReportMaker();

    wallet.render();
    reportMaker.render();

    this.walletList = wallet.walletList;
  }

  static addAddress(address: { address: string, alias: string }) {
    this.walletList.addAddress(address);
  }
}

App.init();
