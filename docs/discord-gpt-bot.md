# Discord GPT Bot for Image Generation AI

A Discord Bot helps you create descriptive prompts for image generation AI like Midjourney or LeonardoAI. The integration with discord provides a convient way for users to combine ChatGPT and Midjourney.

## Overview

The usage pattern can be illustrated as follows:
![solution overview](https://github.com/vivitian930/discord-gpt-bot/blob/main/images/discord-bot.svg?raw=true)

## How to use

### Setup environment

```bash
DISCORD_TOKEN={YourDiscordToken}
DISCORD_SERVER_ID={YourDiscordServerID}
OPENAI_ORG={YourOpenAIOrgizationID}
OPENAI_KEY={YourOpenAIAPIKey}
```

## Start the bot

```bash
# install dependencies
npm install

# start the bot
npm start
```

## Commands for the bot

1. `/gpt_random` - generate {number = 3} random prompts
   ![gpt_random](https://github.com/vivitian930/discord-gpt-bot/blob/main/images/gpt_random.png?raw=true)
2. `/gpt_mock` - generate {number = 2} similar prompts based on user input prompt
   ![gpt_mock](https://github.com/vivitian930/discord-gpt-bot/blob/main/images/gpt_mock.png?raw=true)
3. `/gpt_complete` - generate {number = 3} prompts based on user provided concept
   ![gpt_complete](https://github.com/vivitian930/discord-gpt-bot/blob/main/images/gpt_complete.png?raw=true)

## Deploy at scale

The bot is stateless, so it can be easily scaled out or in. A simple deployment in kubernetes will work.
