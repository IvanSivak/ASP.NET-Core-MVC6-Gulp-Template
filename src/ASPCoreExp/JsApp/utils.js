// Utils module.
// Just for demonstration purposes.

var Utils = (function (window) {

    // Methods
    var fact = function (num) {
        return num <= 1 ? num : num * fact(num - 1);
    };

    // Public
    return {
        fact: fact
    };
})(this, undefined);