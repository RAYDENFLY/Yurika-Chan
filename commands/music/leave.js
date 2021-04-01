const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {

        name: "leave",
        description: "keluar dari seluran suara",
        usage: "dc",
        aliases: ["dc","lv"],
        category: "music",

    run: async function (client, message, args) {
      if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.leave();
    } else {
      message.reply('You need to join a voice channel first!');
    }

    }
}