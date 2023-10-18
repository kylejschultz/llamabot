const { logger } = require("../../utils/logger");
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
                    option.setName('topic')
                        .setDescription('Topic for Llama Chat.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete your channel.')
                .addStringOption(option =>
                    option.setName('channel')
                        .setDescription('Channel ID to delete.')
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
                if (reply.length > 2000) {
                    const chunks = [];
                    let index = 0;
                    while (index < messageContent.length) {
                    const chunk = messageContent.slice(index, Math.min(index + maxCharacters, messageContent.length));
                    chunks.push(chunk);
                    index += maxCharacters;
                    }

                    for (const chunk of chunks) {
                        await interaction.channel.send(chunk);
                    }
                } else{
                    await interaction.editReply(reply);
                }
                break;
            
            case 'new':
                await interaction.deferReply();
                const channel = interaction.channel;
                const user = interaction.user;
                const thread = await channel.threads.create({
                    name: interaction.options.getString('topic'),
                    autoArchiveDuration: 10080,
                    reason: "Llama Chat"
                });
                await interaction.editReply('Thread created. Adding you, then summoning the Llama...');
                await thread.members.add(user);
                if (thread.joinable) await thread.join();
                await interaction.editReply('Llama summoned. You may now chat with the Llama.');
                break;
            
            case 'delete':
                await interaction.deferReply();
                await interaction.guild.channels.cache.get(interaction.options.getString('channel')).delete();
                await interaction.editReply("Channel deleted.")
                break;
            default:
                await interaction.reply("No subcommand found.");
        }
    }
};
