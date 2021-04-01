const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
  
    name: "skipto",
    description: "Lewati ke nomor antrian yang dipilih",
    usage: "skipto <number>",
    aliases: ["st"],
    category: "music",

  run: async function (client, message, args) {
    if (!args.length || isNaN(args[0]))
      return message.channel.send({
                        embed: {
                            color: "GREEN",
                            description: `**How to use**: \`${client.config.prefix}skipto <number>\``
                        }
   
                   }).catch(console.error);
        

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("There is no queue.",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`Queue : ${queue.songs.length} Long song!`,message.channel).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
     try{
    queue.connection.dispatcher.end();
      }catch (error) {
        queue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
       return sendError(`:notes: Music has stopped and the queue has been cleared.: ${error}`, message.channel);
      }
    
    queue.textChannel.send({
                        embed: {
                            color: "GREEN",
                            description: `${message.author} ⏭ skip it \`${args[0] - 1}\` song`
                        }
   
                   }).catch(console.error);
                   message.react("✅")

  },
};
