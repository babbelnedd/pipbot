(function () {
    'use strict';

    var settings = require('../settings'),
        discord = require('discord.js'),
        moment = require('moment'),
        log = require('../log');

    var commands = {};
    var defaultOptions = {
        tts: false
    };
    var defaultCallback = function (err, msg) {
        if (err) {
            log.error('DEFAULT ERROR HANDLER', {err: err, msg: msg})
        }
    };

    function reply(bot, message, opts, cb, reply) {
        opts = opts || defaultOptions;
        cb = cb || defaultCallback;
        bot.sendMessage(message.channel, reply, opts, cb);
    }

    // ========== COMMANDS ==========

    commands['uptime'] = {
        aliases: ['up'],
        description: 'Bot Uptime',
        pm: true,
        auth: 0,
        params: false,
        fn: function (bot, message, params, options, cb) {
            var msg = require('../relative-time').fromMilliseconds(bot.uptime);

            reply(bot, message, options, cb, msg);
        }
    };

    commands['countdown'] = {
        aliases: ['cd'],
        description: 'Countdown to Closed Beta',
        pm: true,
        auth: 0,
        params: false,
        fn: function (bot, message, params, options, cb) {
            var timeLeft = moment('17.11.2015 18:00:00', 'DD.MM.YYYY HH:mm:ss').diff(moment());
            var msg = require('../relative-time').fromMilliseconds(timeLeft);

            reply(bot, message, options, cb, msg);
        }
    };

    commands['paladinsworld'] = {
        aliases: ['pw'],
        description: 'Homepage of PaladinsWorld',
        pm: true,
        auth: 0,
        params: false,
        fn: function (bot, message, params, options, cb) {
            var msg = 'http://www.paladinsworld.com/';
            reply(bot, message, options, cb, msg);
        }
    };

    commands['ping'] = {
        aliases: [],
        description: 'Ping the bot',
        pm: true,
        auth: 0,
        params: false,
        fn: function (bot, message, params, options, cb) {
            var msg = 'Pong';
            reply(bot, message, options, cb, msg);
        }
    };

    commands['avatar'] = {
        aliases: [],
        description: 'Gets the avatar of an user. ex: !avatar @pipbot',
        pm: false,
        auth: 0,
        params: true,
        fn: function (bot, message, params, options, cb) {
            if (message instanceof discord.Message) {
                var mentions = message.mentions;
                if (mentions.length == 1 && mentions[0] instanceof discord.User) {
                    var msg = 'https://discordapp.com/api/users/' + message.mentions[0].id + '/avatars/' + message.mentions[0].avatar + '.jpg';
                    reply(bot, message, options, cb, msg);
                }
            }
        }
    };

    commands['master'] = {
        aliases: [],
        description: 'Kappa',
        pm: false,
        auth: 0,
        params: false,
        fn: function (bot, message, params, options, cb) {
            for (var i = 0; i < message.channel.members.length; i++) {
                var master;
                var member = message.channel.members[i];
                if (member.id === '83521800914341888') {
                    master = member;
                    break;
                }
            }
            if (master instanceof discord.User) {
                var msg = master.mention();
                reply(bot, message, options, cb, msg);
            }
        }
    };

    commands['help'] = {
        aliases: [],
        description: 'Print this message',
        pm: true,
        auth: 0,
        params: false,
        fn: function (bot, message, params, options, cb) {
            var msg = '```';

            for (var cmd in commands)
                if (commands.hasOwnProperty(cmd))
                    if ((!message.isPrivate && commands[cmd].auth === 0) ||
                        (message.isPrivate && commands[cmd].auth <= getAuth(message))) {
                        var cmsg = settings.prefix + cmd;
                        if (commands[cmd].aliases.length > 0) {
                            cmsg += ' [';
                            for (var i = 0; i < commands[cmd].aliases.length; i++) {
                                if (i > 0) msg += ', ';
                                cmsg += commands[cmd].aliases[i];
                            }
                            cmsg += ']';
                        }

                        while (cmsg.length < 25) {
                            cmsg += ' ';
                        }

                        cmsg += commands[cmd].description;
                        cmsg += '\n';

                        msg += cmsg;
                    }

            msg += '```';

            reply(bot, message, options, cb, msg);
        }
    };

    // ========== EXECUTION ==========

    function getAuth(message) {
        // todo: check user auth level
        return 0;
    }

    function parseCommand(message) {

        log.silly('Parse command');
        var params = [];

        var result;
        if (!message) {
            result = undefined;
        }
        else if (message instanceof discord.Message && message.content.startsWith(settings.prefix)) {
            result = message.content.slice(1).split(' ')[0];
            params = message.content.split(' ');
        }
        else if (typeof message === 'string' && message.startsWith(settings.prefix)) {
            result = message.slice(1).split(' ')[0];
            params = message.split(' ');
        }

        if (typeof result === 'string' && !commands.hasOwnProperty(result)) {

            for (var key in commands) if (commands.hasOwnProperty(key)) {
                var command = commands[key];
                if (command.aliases.contains(result)) {
                    result = key;
                    break;
                }
            }

        }

        if (!commands.hasOwnProperty(result)) {
            result = undefined;
        }

        if (result === undefined) {
            log.silly('Message is not a valid command');
        }

        return {name: result, params: params.slice(1)};

    }

    module.exports.canExecute = function (bot, message) {

        log.silly('Check if message can be executed');

        if (message.author.username === bot.user.username) {
            log.silly('Message is by myself - skip');
            return false;
        }

        // todo: permissions
        var cmd = parseCommand(message);
        var cmdName = cmd.name;
        var isCommand = !!commands.hasOwnProperty(cmdName);
        log.silly('Message is ' + (isCommand ? '' : ' not') + ' a valid command');

        if (isCommand && commands[cmdName].auth > getAuth(message)) {
            log.warn('No permissions to execute this command available', message);
            return false;
        }

        if (isCommand && message.isPrivate && commands[cmdName].pm === false) {
            log.debug('Command can not be executed via PM');
            return false;
        }

        if (isCommand && commands[cmdName].params === false && cmd.params.length > 0) {
            log.debug('Command does not accept parameters');
            return false;
        }

        return isCommand;

    };

    module.exports.execute = function (bot, message, options, cb) {

        var cmd = parseCommand(message);

        log.debug('Execute Command', cmd.name);
        commands[cmd.name].fn(bot, message, cmd.params, options, cb);

    }

})();
