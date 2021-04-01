const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
var ytpl = require("ytpl");
const sendError = require("../../util/error");
const fs = require("fs");

module.exports = {

        name: "playlist",
        description: "playlist",
        usage: "<YouTube Playlist URL | Playlist Name>",
        aliases: ["pl"],
        category: "music",


    run: async function (client, message, args) {
        const channel = message.member.voice.channel;
        if (!channel) return sendError("Sorry, but you have to use voice to play music!", message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        var searchString = args.join(" ");
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError("I can't connect in this voice, make sure I have the appropriate permissions!", message.channel);
        if (!permissions.has("SPEAK")) return sendError("I can't speak in this voice, make sure I have the appropriate permissions!", message.channel);

        if (!searchString || !url) return sendError(`Cara pakai: ${message.client.config.prefix}playlist <YouTube playlist link | nama playlist >`, message.channel);
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            try {
                const playlist = await ytpl(url.split("list=")[1]);
                if (!playlist) return sendError("Playlist not found `404 Not Found`", message.channel);
                const videos = await playlist.items;
                for (const video of videos) {
                    // eslint-disable-line no-await-in-loop
                    await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
                }
                return message.channel.send({
                    embed: {
                        color: "GREEN",
                        description: `✅  **|**  Playlist: **\`${videos[0].title}\`** has been added to the queue`,
                    },
                });
            } catch (error) {
                console.error(error);
                return sendError("Playlist Not Found :(  `404 Not Found`", message.channel).catch(console.error);
            }
        } else {
            try {
                var searched = await yts.search(searchString);

                if (searched.playlists.length === 0) return sendError("I can't seem to find the playlist on YouTube", message.channel);
                var songInfo = searched.playlists[0];
                let listurl = songInfo.listId;
                const playlist = await ytpl(listurl);
                const videos = await playlist.items;
                for (const video of videos) {
                    // eslint-disable-line no-await-in-loop
                    await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
                }
                let thing = new MessageEmbed()
                    .setAuthor("The playlist has been added to the queue", client.user.displayAvatarURL(), 'https://discord.js.org')
                    .setThumbnail(songInfo.thumbnail)
                    .setColor("GREEN")
                    .setDescription(`✅  **|**  Playlist: **\`${songInfo.title}\`** Has been added \`${songInfo.videoCount}\` videos to the queue`);
                return message.channel.send(thing);
            } catch (error) {
                return sendError("unexpected error has appeared contact soon <@704453481792143361> / RAY#9422 or <@740462519138779158> DevNight#3250", message.channel).catch(console.error);
            }
        }

        async function handleVideo(video, message, channel, playlist = false) {
            const serverQueue = message.client.queue.get(message.guild.id);
            const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                views: video.views ? video.views : "-",
                ago: video.ago ? video.ago : "-",
                duration: video.duration,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                img: video.thumbnail,
                req: message.author,
            };
            if (!serverQueue) {
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

                try {
                    var connection = await channel.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.error(`Saya tidak dapat bergabung ke voice: ${error}`);
                    message.client.queue.delete(message.guild.id);
                    return sendError(`saya tidak dapat bergabung ke voice: ${error}`, message.channel);
                }
            } else {
                serverQueue.songs.push(song);
                if (playlist) return;
                let thing = new MessageEmbed()
                .setAuthor('Mulai memutar musik', client.user.displayAvatarURL(), 'https://discord.js.org')
                .setThumbnail(song.img)
                .setColor("BLUE")
                .addField("Nama", song.title, true)
                .addField("Durasi", song.duration, true)
                .addField("permintaan oleh", song.req.tag, true)
                .setFooter(`Telah di tonton: ${song.views} | ${song.ago}`);
                return message.channel.send(thing);
            }
            return;
        }

        async function play(guild, song) {
            const serverQueue = message.client.queue.get(message.guild.id);
            if (!song) {
                sendError(
                    "Keluar dari voice channel,jika kamu ingin bot ini berjalan 24/7 silahkan jalankan commands `e.join`. terima kasih",
                    message.channel
                );
                message.guild.me.voice.channel.leave(); //If you want your bot stay in vc 24/7 remove this line :D
                message.client.queue.delete(message.guild.id);
                return;
            }
            let stream = null;
            if (song.url.includes("youtube.com")) {
                stream = await ytdl(song.url);
                stream.on("error", function (er) {
                    if (er) {
                        if (serverQueue) {
                            serverQueue.songs.shift();
                            play(guild, serverQueue.songs[0]);
                            return sendError(`An unexpected error occurred. \n Possible types \`${er}\``, message.channel);
                        }
                    }
                });
            }

            serverQueue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
            const dispatcher = serverQueue.connection.play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus" })).on("finish", () => {
                const shiffed = serverQueue.songs.shift();
                if (serverQueue.loop === true) {
                    serverQueue.songs.push(shiffed);
                }
                play(guild, serverQueue.songs[0]);
            });

            dispatcher.setVolume(serverQueue.volume / 100);
            let thing = new MessageEmbed()
                .setAuthor('Playing Music', client.user.displayAvatarURL(), 'https://discord.js.org')
                .setThumbnail(song.img)
                .setColor("BLUE")
                .addField("Name", song.title, true)
                .addField("Duration", song.duration, true)
                .addField("Requested By", song.req.tag, true)
                .setFooter(`Views: ${song.views} `);
            serverQueue.textChannel.send(thing);
        }
    },
};
