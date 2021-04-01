const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "waifu",
  description: "Free Waifu Image",
  category: "Image",
  run: async (bot, message, args) => {

        fetch("https://waifu.pics/api/sfw/waifu")
      .then(res => res.json())
      .then(body => {
        if (!body)
          return message.channel.send("An error occured, please try again!");

        let embed = new Discord.MessageEmbed()
          .setAuthor(`Here's Your Waifu`)
          .setImage(body.url)
          .setColor("RANDOM")
          .setTimestamp()
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          ;

        return message.channel.send(embed);
      });
  }
};