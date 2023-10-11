const { log } = require("console");
const { SlashCommandBuilder } = require('discord.js');
const { Ollama } = require("langchain/llms/ollama");
const { ChatOllama }  = require("langchain/chat_models/ollama");
const { StringOutputParser } = require("langchain/schema/output_parser");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('llama')
        .setDescription('Interact with the Llama.')
        .addSubcommand(subcommand =>
            subcommand
        		.setName('single')
                .setDescription('Single message to Ollama instance - for testing purposes, mostly. No memory.')
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
            case 'single':
                await interaction.deferReply({ ephemeral: true }); // Defer reply to avoid timeouts
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
            default:
                await interaction.reply("No subcommand found.");
        }
        

	},
};
