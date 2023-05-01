import Discord from "discord.js";
import ytdl from "ytdl-core";
import OpusScript from "opusscript";

import BotToken from "./data/BotToken.json" assert { type: "json" }; // Modify the import to suit your application

const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent"] });
const TOKEN = BotToken.token;

let servers = {};

client.on("ready", () => {
    console.log(`\nLogged in as ${client.user.tag}.`);
});

client.on("messageCreate", message => {
    if(message.author.bot) return;

    const args = message.content.split(" ");

    switch(args[0]) {
        case "#ping": 
            message.reply("pong");

        case "#play":

            const play = (connection, message) => {
                let server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], { filter: "audioonly" }));

                server.queue.shift();

                server.dispatcher.on("end", () => {
                    if(server.queue[0]) {
                        play(connection, message);
                    } else {
                        connection.disconnect();
                    }
                })
            }

            if(!args[1]) {
                message.channel.send("Type the goddamn song name");
                return;
            }

            // Checking if the user is connected to a voice channel
            if(!message.member.voice.channel) {
                message.channel.send("Join a freakin voice channel bitch");
                return;
            }

            // Checking if the queue exists
            if(!servers[message.guild.id])
                servers[message.guild.id] = {
                    queue: []
                }
            
            // Getting the user server
            let server = servers[message.guild.id];

            console.log(message.member.voice.channel);
            // if(!message.guild.voiceConnection)
            //     message.member.voice.channel.join().then(connection => {
            //         play(connection, message);  
            //     })

        break;
    }
});

client.login(TOKEN)