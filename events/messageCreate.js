const { Events } = require('discord.js');
const logger = require('../utils/logger');
const { BufferMemory } = require("langchain/memory");
const { ChatPromptTemplate, MessagesPlaceholder } = require("langchain/chat_models/ollama");
const { RedisChatMessageHistory }  = require("langchain/stores/message/ioredis");
const { ConversationChain } = require("langchain/chains");
const { ChatOllama } = require("langchain/chat_models/ollama");
const { Redis } = require('ioredis');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, event) {
        // If message is private or public thread, not from a bot, and doesnt start with a slash, process.
        if ((message.channel.type === 11 || message.channel.type === 12 ) && !message.author.bot && !message.content.startsWith("/")) {
            let threadID = message.channelId;
            let authorName = message.author.username;
            let messageContent = message.content;
           
            const memory = new BufferMemory({
                chatHistory: new RedisChatMessageHistory({
                    sessionId: threadID,
                    sesstionTTL: 300,
                    url: process.env.REDIS_URL,
                }),
            });
            
            const model = new ChatOllama({
                baseUrl: process.env.LLAMA_URL,
                model: process.env.LLAMA_MODEL,
                temperature: process.env.LLAMA_TEMP || 0.9,
            });

            const chain = new ConversationChain({ llm: model, memory });
            const response = await chain.call({ input: messageContent });

            reply = response.response
                if (reply.length > 2000) {
                    const chunks = [];
                    let index = 0;
                    let maxCharacters = 1995;
                    while (index < messageContent.length) {
                    const chunk = messageContent.slice(index, Math.min(index + maxCharacters, messageContent.length));
                    chunks.push(chunk);
                    index += maxCharacters;
                    }

                    for (const chunk of chunks) {
                        await message.channel.send(chunk)
                    }
                } else {
                        await message.channel.send(reply);
                    }
        }
    }
};