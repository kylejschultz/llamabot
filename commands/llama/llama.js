const { log } = require("console");
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { Ollama } = require("langchain/llms/ollama");
const { ChatOllama }  = require("langchain/chat_models/ollama");
const { StringOutputParser } = require("langchain/schema/output_parser");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('llama')
        .setDescription('Interact with the Llama.')
        .addSubcommand(subcommand =>
            subcommand
        		.setName('q')
                .setDescription('Single message to Ollama instance - for testing purposes, mostly. No memory.')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Message to send to Ollama.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('new')
                .setDescription('Start a new conversation thread with the Llama.')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Message to send to Ollama.')
                        .setRequired(true))),
    async execute(interaction) {
        const chat = new ChatOllama({
            baseUrl: process.env.LLAMA_URL,
            model: process.env.LLAMA_MODEL,
        });
        const subcommand = interaction.options.getSubcommand();

        switch(subcommand) {
            case 'q':
                await interaction.deferReply(); // Defer reply to avoid timeouts
                const message = interaction.options.getString('message'); 
                const stream = await chat
                    .pipe(new StringOutputParser())
                    .stream(message)
                
                const chunks = [];
                for await (const chunk of stream) {
                    chunks.push(chunk);
                }
                reply = chunks.join("");
                await interaction.editReply(reply);
                break;
            case 'new':
                await interaction.deferReply();
                newChannel = await interaction.guild.channels.create({
                    name: "llama-chat",
                    type: ChannelType.GuildText,
                    parent: process.env.DISCORD_CATEGORY
                });
                console.log(newChannel);
                await interaction.editReply("Created new channel: " + interaction.guild.channels.cache.get(newChannel.id).toString());
                break;
            default:
                await interaction.reply("No subcommand found.");
        }
        

	},
};
