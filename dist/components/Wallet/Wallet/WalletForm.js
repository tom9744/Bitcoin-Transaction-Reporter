import App from "../../app.js";
var WalletForm = (function () {
    function WalletForm() {
        this.formElem = document.createElement("form");
        this.formElem.className = "wallet--form";
        this.formElem.innerHTML = "\n      <input class=\"wallet--input\" type=\"text\" />\n      <button class=\"wallet--button__add\">\uB4F1\uB85D</button>\n    ";
        var buttonElem = this.formElem.querySelector("button");
        buttonElem.addEventListener("click", this.addToList.bind(this));
    }
    WalletForm.prototype.addToList = function (event) {
        event.preventDefault();
        var inputElem = this.formElem.querySelector("input");
        var newAddr = inputElem.value;
        inputElem.value = "";
        App.addAddress(newAddr);
    };
    WalletForm.prototype.render = function () {
        return this.formElem;
    };
    return WalletForm;
}());
export default WalletForm;
//# sourceMappingURL=WalletForm.js.map