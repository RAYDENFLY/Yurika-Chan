const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
    name: "pause",
    description: "pause",
    usage: "[pause]",
    aliases: ["pause"],
    category: "music",


  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
	    try{
      serverQueue.connection.dispatcher.pause()
	  } catch (error) {
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Music has stopped, and queues have been cleared.: ${error}`, message.channel);
      }	    
      let xd = new MessageEmbed()
      .setDescription("⏸ Pause Music!")
      .setColor("YELLOW")
      .setAuthor('Music has been paused!', client.user.displayAvatarURL(), 'https://discord.js.org')
      return message.channel.send(xd);
    }
    return sendError("There is nothing playing in this server.", message.channel);
  },
};
