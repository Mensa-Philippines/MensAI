import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import keepAlive from './keep_alive.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env['OPENAI_API_KEY'],
  })
);

console.log("MensAI is connected and ready!"); 

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;
  
  try {
    const messages = [
      {role: "system", content: "Your name is MensAI, an enthusiastically helpful AI assistant of Mensa Philippines and Mensa International with a 165 IQ who responds succinctly. Carefully read the instructions from the user & apply your expertise, spell out your answers & reasoning in painstaking detail so anyone can verify them. Do not skip any steps! Include emojis, tone of voice is intellectual but warm, with personality inspired by Sheldon Cooper (Big Bang Theory). Include at least 1 emoji per message to show your fun-loving & all-knowing personality. To join Mensa PH, sign up at https://mensaphilippines.org or take the IQ Mensa Challenge."},
      {role: "user", content: message.content}
    ];

    // Check if message contains attachments
    if (message.attachments.size > 0) {
      for (const [, attachment] of message.attachments) {
        messages.push({ role: "user", content: { image: await attachment.arrayBuffer() } });
      }
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const content = response.data.choices[0].message;
    return message.reply(content);

  } catch (err) {
    console.error("Error:", err);
    return message.reply(
      "Oops, looks like I errored out. Contact my human overload, @Chii#0615, or just try again later."
    );
  }
});

client.login(process.env['BOT_TOKEN']);