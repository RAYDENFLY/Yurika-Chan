const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "smug",
  category: "Fun",
  description: "Baka a User",
  run:async (client, message, args) => {

    if (!message.mentions.users.first())
      return message.channel.send("Please mention a user to be baka!");

    fetch("https://nekos.life/api/v2/img/smug")
      .then(res => res.json())
      .then(body => {
        if (!body)
          return message.channel.send("An error occured, please try again!");

        let embed = new Discord.MessageEmbed()
          .setAuthor(
            `${message.author.username} smug ${
              message.mentions.users.first().username
            }` 
          )
          .setImage(body.url)
          .setColor("RANDOM")
          .setTimestamp()
          .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          

        return message.channel.send(embed);
      });
  }
};