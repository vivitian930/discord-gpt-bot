require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.once("ready", async () => {
  try {
    const commands = [
      {
        name: "ping",
        description: "Ping!"
      },
      {
        name: "server",
        description: "Get server info"
      },
      {
        name: "user-info",
        description: "Get user info"
      },
      {
        name: "help",
        description: "List available commands"
      }
    ];

    const commandData = commands.map((command) => ({
      name: command.name,
      description: command.description
    }));

    const guildId = process.env.DISCORD_SERVER_ID;

    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

    await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {
      body: commandData
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  } else if (commandName === "user-info") {
    await interaction.reply(
      `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`
    );
  } else if (commandName === "help") {
    await interaction.reply(
      `Available commands:\n/ping\n/server\n/user-info\n/help`
    );
  }
});

// const {Configuration, OpenAIApi} = require('openai');
// const configuration = new Configuration( {
//     organization: process.env.OPENAI_ORG,
//     apiKey: process.env.OPENAI_KEY,
// })

// const openai = new OpenAIApi(configuration);

// client.on("messageCreate", async function (message) {
//   try {
//     if (message.author.bot) return;
//     console.log(message.content);
//     message.reply(`You side: ${message.content}`);
//   } catch (err) {
//     console.log(err);
//   }
// });

client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT bot is now online in Discord.");
