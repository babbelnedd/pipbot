(function () {
    'use strict';

    var settings = require('../../settings.json');
    var auth = require('../../auth.json');

    module.exports = settings;
    module.exports.debug = settings.debug === true;
    module.exports.reconnect = settings.reconnect === true;
    module.exports.log = settings.log;
    module.exports.auth = auth;
    module.exports.servers = settings.servers || [];

})();