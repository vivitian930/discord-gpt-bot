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

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY
});
const openai = new OpenAIApi(configuration);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.once("ready", async () => {
  try {
    const commands = [
      {
        name: "gpt_random",
        description: "Generate a random prompt by ChatGPT!",
        options: [
          {
            name: "number",
            description: "Number of prompts to generate",
            type: 3,
            required: false // Set the argument as required
          }
        ]
      }
      //   {
      //     name: "gpt_completion",
      //     description: "Generate a random prompt by ChatGPT!",
      //     options: [
      //       {
      //         name: "message",
      //         description: "The message to repeat",
      //         type: 3,
      //         required: false // Set the argument as required
      //       }
      //     ]
      //   }
      //   {
      //     name: "server",
      //     description: "Get server info"
      //   },
      //   {
      //     name: "user-info",
      //     description: "Get user info"
      //   },
      //   {
      //     name: "help",
      //     description: "List available commands"
      //   }
    ];

    const commandData = commands.map((command) => ({
      name: command.name,
      description: command.description,
      options: command.options ? command.options : []
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

  const { commandName, options } = interaction;

  await interaction.reply("Working on it");
  if (commandName === "gpt_random") {
    // gpt_random doesn't require a growing context
    const num = options.getString("number")
      ? options.getString("number")
      : "10";
    const message = [
      {
        role: "system",
        content:
          "You are a prompt generator for Midjourney's artificial intelligence \
    program. Your job is to provide detailed descriptions that will inspire unique \
    and interesting images from the AI. Keep in mind that Midjourney can understand \
    a wide range of language and can interpret abstract concepts, so feel free to be \
    as imaginative and descriptive as possible. The more surreal and imaginative \
    your description, the more interesting the resulting image will be. In the end of each prompt, \
    please also add descriptions about image style, camera angle, lighting etc."
      },
      {
        role: "user",
        content: `Generate ${num} imaginative prompts for me.`
      }
    ];
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message
    });
    await interaction.editReply(response.data.choices[0].message.content);
  }
  //   else if (commandName === "server") {
  //     await interaction.reply(
  //       `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
  //     );
  //   } else if (commandName === "user-info") {
  //     await interaction.reply(
  //       `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`
  //     );
  //   } else if (commandName === "help") {
  //     await interaction.reply(
  //       `Available commands:\n/ping\n/server\n/user-info\n/help`
  //     );
  //   }
});

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
