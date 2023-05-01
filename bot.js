import { Client } from "discord.js";
import { DisTube } from "distube";

import BotToken from "./data/BotToken.json" assert { type: "json" };

const client = new Client({ intents: [ "Guilds", "GuildMessages", "GuildVoiceStates", "MessageContent" ] });

client.DisTube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
})

client.on("ready", client => {
    console.log(`\nLogged in as ${client.user.tag}.\n`);
});

client.on("messageCreate", message => {
    if(message.author.bot || !message.guild) return;

    const prefix = "#";
    if(!message.content.toLowerCase().startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    if(args.shift().toLowerCase() === "play") {
        client.DisTube.play(message.member.voice.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        })
    }
});

client.DisTube.on("playSong", (queue, song) => {
    queue.textChannel.send("Now playing " + song.name);
})

client.login(BotToken.token);