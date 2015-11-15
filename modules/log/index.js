(function () {
    'use strict';

    var winston = require('winston');
    var settings = require('../settings');
    var level = require('./level');
    var path = require('path');
    var transports = [];

    var defaultLogLevel = settings.debug === true ? level.debug : level.info;

    if (settings.log.console.enabled) {
        transports.push(new (winston.transports.Console)({
            level: settings.log.console.level || defaultLogLevel
        }))
    }

    if (settings.log.file.enabled) {
        // todo: rotate daily

        var p = path.normalize(settings.log.file.path);
        var defaultLogFile = path.join(p, 'pipbot.log');
        transports.push(new (winston.transports.File)({
            filename: defaultLogFile,
            level: settings.log.file.level || defaultLogLevel
        }));
    }

    var logger = new (winston.Logger)({
        transports: transports
    });

    module.exports = logger;
})();