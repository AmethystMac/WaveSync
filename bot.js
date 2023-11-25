import { Client } from "discord.js";
import { DisTube } from "distube";

import BotToken from "./data/BotToken.json" assert { type: "json" };

const client = new Client({ intents: [ "Guilds", "GuildMessages", "GuildVoiceStates", "MessageContent" ] });

const distube = new DisTube(client, {
    leaveOnStop: false, 
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
});

client.on("ready", client => {
    console.log(`\nLogged in as ${client.user.tag}.\n`);
});

client.on("messageCreate", async message => {
    if(message.author.bot || !message.guild) return;

    const prefix = "#";
    if(!message.content.toLowerCase().startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Setting up music commands to work with the bot
    if(command === "play" || command === "p") {
        distube.play(message.member.voice.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message,
        });
    }

    if(command === "skip" || command === "s") {
        const queue = distube.getQueue(message);
        const currentSong = queue.songs[0].name;
        if(queue.songs.length > 1) {
            distube.skip(message);
        } else {
            distube.stop(message);
        }
        console.log("Skipped " + currentSong);
        message.channel.send("Skipped " + currentSong);
    }

    if(command === "stop"){
        distube.stop(message);
        message.channel.send("Queue has been stopped.");
        console.log("Queue has been stopped.");
    }
});

// Behavior when an event is encountered
distube
    .on("playSong", (queue, song) => {
        console.log("Now playing " + song.name);
        queue.textChannel.send("Now playing " + song.name);
        queue.voice.setSelfDeaf(false);
        queue.voice.setSelfMute(false);
    })
    .on("addSong", (queue, song) => {
        console.log("Added " + song.name + " to the queue.");
        queue.textChannel.send("Added " + song.name + " to the queue.");
    })
    .on("error", (channel, e) => {
        console.error(e);
    });

// Login using discord bot token 
client.login(BotToken.token);