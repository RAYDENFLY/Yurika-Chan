const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error")

module.exports = {
    name: "nowplaying",
    description: "now playing",
    usage: "",
    aliases: ["np"],
    category: "music",

run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("There is nothing playing in this server.", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor('Now Playing', client.user.displayAvatarURL(), 'https://discord.js.org')
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Name", song.title, true)
      .addField("Duration", song.duration, true)
      .addField("Requested By", song.req.tag, true)
      .setFooter(`Views: ${song.views} `)
    return message.channel.send(thing)
  },
};
