import Discord from "discord.js"
import { joinVoiceChannel } from "@discordjs/voice";

const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent"] });
const TOKEN = ""

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}.`);
});

client.on("messageCreate", msg => {
    if(msg.author.bot) return;

    console.log(msg);

    if(msg.content === "ping") {
        msg.reply("pong");
    }

    if(msg.content === "#play") {
        const connection = joinVoiceChannel({
            
        })
    }

    // if(msg.content === "bow before me" && msg.author.username === "AmethystMac") {
    //     msg.reply("ALL HAIL MATTHEW!")
    // }
});

client.login(TOKEN)