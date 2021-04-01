const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const ytdlDiscord = require("ytdl-core-discord");
const yts = require("yt-search");
const fs = require("fs");
const sendError = require("../../util/player");
const player = require("../../util/play")

module.exports = {
        name: "play",
        description: "Playing music",
        usage: "<YouTube_URL> | <song_name>",
        category: "music",
        aliases: ["p","py"],
    run: async function (client, message, args) {
        let channel = message.member.voice.channel;
        if (!channel) return sendError("Maaf, tetapi Anda harus menggunakan voice channel untuk memutar musik!", message.channel);

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError("Saya tidak dapat berbicara di voice ini, pastikan saya memiliki izin yang sesuai!", message.channel);
        if (!permissions.has("SPEAK")) return sendError("Saya tidak dapat berbicara di voice ini, pastikan saya memiliki izin yang sesuai!", message.channel);

        var searchString = args.join(" ");
        if (!searchString) return sendError("Anda tidak memberikan saya link untuk play music", message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        var serverQueue = message.client.queue.get(message.guild.id);

        let songInfo = null;
        let song = null;
        if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
            try {
                songInfo = await ytdl.getInfo(url);
                if (!songInfo) return sendError("Sepertinya saya tidak bisa menemukan lagu tersebut di YouTube", message.channel);
                song = {
                    id: songInfo.videoDetails.videoId,
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    ago: songInfo.videoDetails.publishDate,
                    views: String(songInfo.videoDetails.viewCount).padStart(10, " "),
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        } else {
            try {
                var searched = await yts.search(searchString);
                if (searched.videos.length === 0) return sendError("Sepertinya saya tidak bisa menemukan lagu tersebut di YouTube", message.channel);

                songInfo = searched.videos[0];
                song = {
                    id: songInfo.videoId,
                    title: Util.escapeMarkdown(songInfo.title),
                    views: String(songInfo.views).padStart(10, " "),
                    url: songInfo.url,
                    ago: songInfo.ago,
                    duration: songInfo.duration.toString(),
                    img: songInfo.image,
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        }

        if (serverQueue) {
            serverQueue.songs.push(song);
            let thing = new MessageEmbed()
                .setTitle(song.title, song.duration)
                .setColor("YELLOW")
                .setImage(song.img)
                .setFooter(`Enjoy Playing Music`);
            return message.channel.send(thing);
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 80,
            playing: true,
            loop: false,
        };
        message.client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        const play = async (song) => {
            const queue = message.client.queue.get(message.guild.id);
            if (!song) {
                sendError(
                    "Please add a song to continue",
                    message.channel
                );
                message.client.queue.delete(message.guild.id);
                return;
            }
            let stream = null;
            if (song.url.includes("youtube.com")) {
                stream = await ytdl(song.url);
                stream.on("error", function (er) {
                    if (er) {
                        if (queue) {
                            queue.songs.shift();
                            play(queue.songs[0]);
                            return sendError(`An unexpected error has occurred.\nPossible type \`${er}\``, message.channel);
                        }
                    }
                });
            }
            queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

            const dispatcher = queue.connection.play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus" })).on("finish", () => {
                const shiffed = queue.songs.shift();
                if (queue.loop === true) {
                    queue.songs.push(shiffed);
                }
                play(queue.songs[0]);
            });

            dispatcher.setVolumeLogarithmic(queue.volume / 100);
            let thing = new MessageEmbed()
                .setTitle(song.title,song.duration)
                .setColor("YELLOW")
                .setImage(song.img)
                .setFooter(`Enjoy Playing Music`);
            queue.textChannel.send(thing);
        };

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            play(queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I cannot join to voice: ${error}`);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return sendError(`I cannot join to voice: ${error}`, message.channel);
        }
    },
};
