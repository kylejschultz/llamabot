const { Events, PermissionFlagsBits, OAuth2Scopes } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(bot) {
        const link = bot.generateInvite({
            permissions: [
                PermissionFlagsBits.Administrator
            ],
            scopes: [OAuth2Scopes.Bot],
        });
        const Guilds = bot.guilds.cache.map(guild => guild.name);
        logger.info('============================')
        logger.info(`Logged in as ${bot.user.tag}!`);
        //logger.info(`Use this invite link to join the server: ${link}`);
        //logger.info('Current Guilds: ' + Guilds.join(', '));
    },
};