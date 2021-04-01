const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {

    name: "remove",
    description: "Hapus lagu dari antrian",
    usage: "rm <number>",
    aliases: ["rm"],
    category: "music",

  run: async function (client, message, args) {
   const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("There is no queue.",message.channel).catch(console.error);
    if (!args.length) return sendError(`Cara pakai: ${client.config.prefix}\`remove <Queue Number>\``);
    if (isNaN(args[0])) return sendError(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (queue.songs.length == 1) return sendError("There is no queue.",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`Just the queue ${queue.songs.length} song long !`,message.channel).catch(console.error);
try{
    const song = queue.songs.splice(args[0] - 1, 1); 
    sendError(`❌ **|** Remove: **\`${song[0].title}\`** of the song queue.`,queue.textChannel).catch(console.error);
                   message.react("✅")
} catch (error) {
        return sendError(`:notes: An unexpected error occurred. \n Possible types: ${error}`, message.channel);
      }
  },
};
