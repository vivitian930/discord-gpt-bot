require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// const {Configuration, OpenAIApi} = require('openai');
// const configuration = new Configuration( {
//     organization: process.env.OPENAI_ORG,
//     apiKey: process.env.OPENAI_KEY,
// })

// const openai = new OpenAIApi(configuration);

client.on("messageCreate", async function (message) {
  try {
    if (message.author.bot) return;
    console.log(message.content);
    message.reply(`You side: ${message.content}`);
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT bot is now online in Discord.");
