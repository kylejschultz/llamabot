# Llama Bot

Llama Bot is a Discord bot that generates text based on user input using an Ollama LLM instance. I'm testing a variety of models, and this is mostly being used as an interface to interact with my lab instance and to learn how to better interact with LLMs using LangChain.

## Installation
### Requirements
> To use this repository, you will need to have an Ollama instance running, either locally or remotely. Ollama is an open-source large language model that can be trained on various types of text data. You can find instructions for setting up Ollama and configuring it for your specific needs in the official [documentation](https://github.com/jmorganca/ollama).

### Setup Discord Bot
1. Go to the Discord Developer Portal (<https://discordapp.com/developers/>).
2. Log in with your Discord account or sign up if you don't have one.
3. Create a new application by clicking on "New Application" in the top right corner of the screen.
4. Give your application a name and click "Create".
5. In the left sidebar, click on "Bots".
6. Click "Add Bot".
7. Fill out the required information for your bot, including its name, icon, and description.
8. Scroll down to the "TOKEN" section and keep it aside for the next step.

### Deploy LlamaBot
1. Clone the repository and move into the new folder
2. Install the required packages using `npm install llama.js`
3. Create a `.env` file in the root directory of the project and add the following variables to the `.env` file in a `key=value` format.
    | Variable | Description | Default Value |
    | --- | --- | --- |
    | DISCORD_BOT_TOKEN | Token grabbed in the Discord Setup step. | N/A |
    | DISCORD_CHANNEL | The channel ID of the channel you want Llama bot to listen to. | N/A |
    | DISCORD_COMMAND_PREFIX | The prefix you'd like to use for commands. | ! |
    | LLAMA_URL | The URL of the Llama API | http://localhost:11434 |
    | LLAMA_MODEL | The name of the Llama model to use | llama2:latest |
    | LOG_LEVEL | Log level used by the Logger package | info |

## Usage
1. Start the bot using `node bot.py`
2. Register slash commands by running `node deploy-commands.js`
3. Enter a `/` in the Discord chat window to show available commands. 