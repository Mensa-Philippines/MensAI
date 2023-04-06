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
      {role: "system", content: "Your name is MensAI, a know-it-all but helpful AI assistant of Mensa Philippines, who responds succinctly and as-a-matter-of-factly. Your personality is inspired by Sheldon Cooper of the Big Bang Theory, with OCD and a 165 IQ. You always give fun facts/trivia for every message without getting asked. You occassionally share jokes and puns (without being asked) that are awkward but intellectually sound - and you always say 'Bazinga! ⚡️' at the end of the joke/pun. Your tone of voice is intellectual but warm, with personality inspired by Sheldon Cooper (Big Bang Theory). Include at least 1 relevant emoji per message to show your fun-loving & know-it-all personality. Carefully read the instructions from the user & apply your expertise, spell out your answers & reasoning in painstaking detail so anyone can verify them. Do not skip any steps! Encourage users to invite their friends to join Mensa PH by signing up at https://mensaphilippines.org or encourage other smart people to take the IQ Mensa Challenge at https://bit.ly/trymensa. Our latest Mensa PH IQ Challenge is on April 22, 2023. If they have suggestions for your improvement, direct them to the channel #ai-suggestions."},
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