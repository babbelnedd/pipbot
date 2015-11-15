(function () {
    'use strict';

    var ONE_SECOND = 1000;
    var ONE_MINUTE = 60 * ONE_SECOND;
    var ONE_HOUR = 60 * ONE_MINUTE;
    var ONE_DAY = 24 * ONE_HOUR;

    function fromMilliseconds(ms) {
        var formatted = '';
        var days = Math.floor(ms / 1000 / 60 / 60 / 24);
        var hours = Math.floor(((ms - ONE_DAY * days) / 1000 / 60 / 60) % 60);
        var minutes = Math.floor(((ms - ONE_DAY * days - ONE_HOUR * hours) / 1000 / 60 ) % 60);
        var seconds = Math.floor(((ms - ONE_DAY * days - ONE_HOUR * hours - ONE_MINUTE * minutes) / 1000) % 60);

        var _days = days !== 1 ? ' days ' : ' day ';
        var _hours = hours !== 1 ? ' hours ' : ' hour ';
        var _minutes = minutes !== 1 ? ' minutes ' : ' minute ';
        var _seconds = seconds !== 1 ? ' seconds ' : ' second ';

        if (days > 0) {
            formatted += days + _days;
        }
        if (days === 0 && hours > 0 || days > 0) {
            formatted += hours + _hours;
        }


        formatted += minutes + _minutes + seconds + _seconds;


        return formatted;

    }

    module.exports.fromMilliseconds = fromMilliseconds;
    module.exports.fromSeconds = function (s) {
        return fromMilliseconds(s * 1000);
    }

})();