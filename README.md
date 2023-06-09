# Discord GPT Bot for Image Generation AI

A Discord Bot helps you create descriptive prompts for image generation AI like Midjourney or LeonardoAI.

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
   ![gpt_random](/images/gpt_random.png)
2. `/gpt_mock` - generate {number = 2} similar prompts based on user input prompt
   ![gpt_mock](/images/gpt_mock.png)
3. `/gpt_complete` - generate {number = 3} prompts based on user provided concept
   ![gpt_complete](/images/gpt_complete.png)

## Deploy at scale

The bot is stateless, so it can be easily scaled out or in. A simple deployment in kubernetes will work.
