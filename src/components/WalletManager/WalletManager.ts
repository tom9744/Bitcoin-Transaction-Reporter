import WalletList from "./Wallet/WalletList.js";
import WalletForm from "./Wallet/WalletForm.js";

export default class Wallet {
  public walletList = new WalletList();
  public walletForm = new WalletForm();

  render() {
    const walletSection = document.querySelector(".wallet") as HTMLElement;
    
    const walletFormElem = this.walletForm.render();
    const walletListElem = this.walletList.render();

    walletSection.appendChild(walletFormElem);
    walletSection.appendChild(walletListElem);
  }
}