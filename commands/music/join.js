const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {

        name: "join",
        description: "Bergabung ke seluran suara",
        usage: "join",
        aliases: ["j"],
        category: "music",

    run: async function (client, message, args) {
      if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.reply('You need to join a voice channel first!');
    }

    }
}
