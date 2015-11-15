(function () {
    'use strict';

    if (typeof Array.prototype.contains != 'function') {
        Array.prototype.contains = function (obj) {
            return this.indexOf(obj) !== -1;
        }
    }

})();