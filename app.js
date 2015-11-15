#! /usr/local/bin/node


(function () {
    'use strict';

    // load polyfills
    require('./modules/polyfill');

    var discord = require('discord.js');
    var settings = require('./modules/settings');
    var log = require('./modules/log');
    var signal = require('./modules/signal');
    var commands = require('./modules/commands');
    var bot = new discord.Client();

    bot.login(settings.auth.email, settings.auth.password, onConnectionEstablished);
    bot.on('ready', onReady);

    //bot.on('message', onMessage);
    //bot.on('debug', console.info);
    //bot.on('disconnected', console.info);
    //bot.on('raw', console.info);
    //bot.on('messageDelete', console.info);
    //bot.on('userUnbanned', console.info);
    //bot.on('channelDelete', console.info);
    //bot.on('channelCreate', console.info);
    //bot.on('serverCreate', console.info);
    //bot.on('serverNewMember', console.info);
    //bot.on('userUpdate', console.info);
    //bot.on('presence', console.info);
    //bot.on('channelUpdate', console.info);
    //bot.on('startTyping', console.info);
    //bot.on('stopTyping', console.info);
    //bot.on('serverRoleCreate', console.info);
    //bot.on('serverRoleDelete', console.info);
    //bot.on('serverRoleUpdate', console.info);
    //bot.on('unknown', console.info);
    //bot.on('unavailable', console.info);

    function onConnectionEstablished(err) {

        if (err) {
            log.error('CONNECTION', 'Could not connect to Discord');
            log.error(err);
            process.exit(signal.CONNECTION_FAILED);
        } else {
            log.info('Connection established');
        }

    }

    function onReady() {

        log.info('Ready');

        log.debug('Join Servers');
        settings.servers.forEach(function (server) {
            bot.joinServer(server);
        });

        log.silly('Register Event Listeners');
        bot
            .on('debug', onDebug)
            .on('error', onError)
            .on('disconnect', onDisconnect)
            .on('message', onMessage);
    }

    function onError(err) {
        log.error(err);
    }

    function onDebug(msg) {
        log.debug('DEBUG', msg);
    }

    function onDisconnect() {

        log.info('Disconnected');

        // todo: validate functionality
        if (settings.reconnect) {
            bot.login(auth.email, auth.password);
        } else {
            process.exit(signal.DISCONNECTED);
        }

    }

    function onMessage(message) {

        log.silly('Received message', message);

        if (commands.canExecute(bot, message)) {
            commands.execute(bot, message);
        }

    }


})();