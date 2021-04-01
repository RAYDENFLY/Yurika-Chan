const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {

    name: "stop",
    description: "Hentikan musik dan hapus antrian",
    usage: "",
    aliases: [],
    category: "music",

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Sorry, but you have to use voice to play music!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("There is no song play I can stop for you.", message.channel);
   if(!serverQueue.connection)return
if(!serverQueue.connection.dispatcher)return
     try{
      serverQueue.connection.dispatcher.end();
      } catch (error) {
        message.guild.me.voice.channel.leave();
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes:Music has stopped and the queue has been cleared.: ${error}`, message.channel);
      }
    message.client.queue.delete(message.guild.id);
    serverQueue.songs = [];
    message.react("✅")
  },
};