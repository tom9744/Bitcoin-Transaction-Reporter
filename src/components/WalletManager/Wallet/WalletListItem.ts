export default class WalletListItem {
  private address: { address: string, alias: string };

  constructor(address: { address: string, alias: string }) {
    this.address = address;
  }

  render() {
    const walletListItemElem = document.createElement("li");
    walletListItemElem.className = "wallet--listitem";
    walletListItemElem.innerHTML = `
      <div class="wallet--info">
        <p class="wallet--paragraph__alias">${this.address.alias}</p>
        <p class="wallet--paragraph__address">${this.address.address}</p>
      </div>

      <button class="wallet--button__remove">𝗫</button>
    `;

    return walletListItemElem;
  }
}