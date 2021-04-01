const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {

    name: "resume",
    description: "Continue music",
    usage: "",
    aliases: [],
    category: "music",

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setDescription("▶ Resume music!")
      .setColor("YELLOW")
      .setAuthor("Resume!", client.user.displayAvatarURL(), 'https://discord.js.org')
      return message.channel.send(xd);
    }
    return sendError("Nothing is playing on this server.", message.channel);
  },
};
