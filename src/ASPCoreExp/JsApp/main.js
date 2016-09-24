// Your JavaScript code here..

// Main module
var MyApp = (function () {

    // Methods
    var start = function (num) {
        $('h1:last').append('Factorial of 5 = ' + Utils.fact(5));
    };

    // Public
    return {
        start: start
    };
})(this, undefined);

MyApp.start();