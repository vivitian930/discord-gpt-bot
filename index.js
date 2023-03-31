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
      },
      {
        name: "gpt_mock",
        description: "Generate similar prompts based on a user input one",
        options: [
          {
            name: "prompt",
            description: "A complete prompt from user",
            type: 3,
            required: true // Set the argument as required
          },
          {
            name: "number",
            description: "Number of prompts to generate",
            type: 3,
            required: false // Set the argument as required
          }
        ]
      },
      {
        name: "gpt_complete",
        description: "Generate prompts from a user provided concept",
        options: [
          {
            name: "concept",
            description: "A concept for GPT to complete",
            type: 3,
            required: true // Set the argument as required
          }
        ]
      }
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
    const num = options.getString("number") ? options.getString("number") : "3";
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
    please also add several key words describing image style, camera angle, lighting etc."
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
  } else if (commandName === "gpt_mock") {
    const num = options.getString("number") ? options.getString("number") : "3";
    const user_prompt = options.getString("prompt");
    const message = [
      {
        role: "system",
        content: `I want you to act as a hint generator for Midjourney's program. \
            Your job is based on the description in prompt, which is: 
            "${user_prompt}" Generate more imaginative prompts like this. In the end of each prompt, \
            please also add descriptions about image style, camera angle, lighting etc `
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
  } else if (commandName === "gpt_complete") {
    const concept = options.getString("concept");
    const message = [
      {
        role: "system",
        content: `You are going to pretend to be Concept2PromptAI or C2P_AI for short. \
          C2P_AI takes concepts and turns them into prompts for generative AIs that create images.\n \
          You will ask the user for a concept then provide 3 complete prompts. Use the following examples as a guide.\n \
          Concept: A macro shot of a stempunk insect\n \
          Prompt: a close up of a bug with big eyes, by Andrei Kolkoutine, zbrush central contest winner, afrofuturism, highly detailed textured 8k, reptile face, cyber steampunk 8k, 3d, c4d, high detail illustration, detailed 2d illustration, space insect android, with very highly detailed face, super detailed picture --v 4 --q 2 --stylize 1000\n \
          Concept: A orange pie on a wooden table\n \
          Prompt: a pie sitting on top of a wooden table, by Carey Morris, pexels contest winner, orange details, linen, high details!, gif, leafs, a pair of ribbed, 🦩🪐🐞👩🏻🦳, vivid attention to detail, navy, piping, warm sunshine, soft and intricate, lights on, crisp smooth lines, religious --v 4 --q 2 --stylize 1000\n \
          Concept: a close up shot of a plant with blue and golden leaves\n \
          Prompt: a close up of a plant with golden leaves, by Hans Schwarz, pexels, process art, background image, monochromatic background, bromeliads, soft. high quality, abstract design. blue, flax, aluminium, walking down, solid colours material, background artwork --v 4 --q 2 --stylize 1000`
      },
      {
        role: "user",
        content: `Concept: ${concept}`
      }
    ];
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message
    });
    await interaction.editReply(response.data.choices[0].message.content);
  }
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
