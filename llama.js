/**************************/
/* Imports and Constraints*/
/**************************/
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, PermissionFlagsBits, OAuth2Scopes } = require('discord.js');
require('dotenv').config();

/*****************/
/* Logging Setup */
/*****************/
const pino = require('pino');
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})  

/**************************************/
/* Bot Setup and Command Registration */
/**************************************/
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
bot.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			bot.commands.set(command.data.name, command);
		} else {
			logger.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


/**************/
/* Bot Events */
/**************/
bot.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		logger.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		logger.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

bot.on('ready', () => {
    const link = bot.generateInvite({
        permissions: [
            PermissionFlagsBits.Administrator
        ],
        scopes: [OAuth2Scopes.Bot],
    });
    const Guilds = bot.guilds.cache.map(guild => guild.name);
    logger.info('============================')
    logger.info(`Logged in as ${bot.user.tag}!`);
    logger.info(`Use this invite link to join the server: ${link}`);
    logger.info('Current Guilds: ' + Guilds.join(', '));
});
  
/* Bot Login */
bot.login(process.env.DISCORD_BOT_TOKEN);