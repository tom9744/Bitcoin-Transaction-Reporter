import App from "../../../App.js";
var WalletForm = (function () {
    function WalletForm() {
        this.formElem = document.createElement("form");
        this.formElem.className = "wallet--form";
        this.formElem.innerHTML = "\n      <div class=\"wallet--input-wrapper\">\n        <label for=\"address\">\uC9C0\uAC11\uC8FC\uC18C</label>\n        <input \n          type=\"text\" \n          id=\"address\" \n          class=\"wallet--input__address\" \n          placeholder=\"\uBCF4\uACE0\uC11C\uC5D0 \uB4F1\uB85D\uD560 \uC9C0\uAC11\uC8FC\uC18C\" \n        />\n      </div>\n\n      <div class=\"wallet--input-wrapper\">\n        <label for=\"alias\">\uBCC4\uBA85</label>\n        <input \n          type=\"text\" \n          id=\"alias\" \n          class=\"wallet--input__alias\" \n          placeholder=\"\uC9C0\uAC11\uC8FC\uC18C\uB97C \uAE30\uC5B5\uD558\uAE30 \uC704\uD55C \uBCC4\uBA85\" \n        />\n      </div>\n\n      <button class=\"wallet--button__add\">\uC9C0\uAC11\uC8FC\uC18C \uCD94\uAC00</button>\n    ";
        var buttonElem = this.formElem.querySelector("button");
        buttonElem.addEventListener("click", this.addToList.bind(this));
    }
    WalletForm.prototype.addToList = function (event) {
        event.preventDefault();
        var addressInputElem = this.formElem.querySelector(".wallet--input__address");
        var aliasInputElem = this.formElem.querySelector(".wallet--input__alias");
        var newAddr = addressInputElem.value;
        var newAlias = aliasInputElem.value;
        addressInputElem.value = "";
        aliasInputElem.value = "";
        App.addAddress({ address: newAddr, alias: newAlias });
    };
    WalletForm.prototype.render = function () {
        return this.formElem;
    };
    return WalletForm;
}());
export default WalletForm;
//# sourceMappingURL=WalletForm.js.map