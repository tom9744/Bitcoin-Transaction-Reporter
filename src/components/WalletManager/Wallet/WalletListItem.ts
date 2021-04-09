export default class WalletListItem {
  private address: string;

  constructor(address: string) {
    this.address = address;
  }

  render() {
    const walletListItemElem = document.createElement("li");
    walletListItemElem.className = "wallet--listitem";
    walletListItemElem.innerHTML = `
      <p class="wallet--paragraph">${this.address}</p>
      <button class="wallet--button__remove">𝗫</button>
    `;

    return walletListItemElem;
  }
}