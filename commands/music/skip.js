const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {

    name: "skip",
    description: "Lewati musik saat ini",
    usage: "",
    aliases: ["s"],
    category: "music",


  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Sorry, but you have to use voice to play music!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("Sorry, but you have to use voice to play music! There is no playback I can miss for you.", message.channel);
        if(!serverQueue.connection)return
if(!serverQueue.connection.dispatcher)return
     if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setAuthor('memutar', client.user.displayAvatarURL(), 'https://discord.js.org')
      .setDescription("▶ Memutar  musik untuk kamu!")
      .setColor("YELLOW")
      .setTitle("Musik telah di resume!")
       
   return message.channel.send(xd).catch(err => console.log(err));
      
    }


       try{
      serverQueue.connection.dispatcher.end()
      } catch (error) {
        serverQueue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Musik telah berhenti dan antrian telah dihapus.: ${error}`, message.channel);
      }
    message.react("✅")
  },
};
