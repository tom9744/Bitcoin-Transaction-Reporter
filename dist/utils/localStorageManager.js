var LocalStorageManager = (function () {
    function LocalStorageManager() {
    }
    LocalStorageManager.prototype.setItem = function (key, newValue) {
        localStorage.setItem(key, newValue);
    };
    LocalStorageManager.prototype.getItem = function (key) {
        localStorage.getItem(key);
    };
    return LocalStorageManager;
}());
export default LocalStorageManager;
//# sourceMappingURL=localStorageManager.js.map