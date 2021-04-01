const Discord = require('discord.js');//npm i discordjs@12.2.0 
const superagent = require('superagent'); //npm i superagent
const canvas = require('canvas')

module.exports = {
  name: "gay",
  description: "Get the gay of anywhere",
  category: "Filter",
  usage: "gay <>",
  run: (client, message, args) => {
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

            if (!Member) return message.channel.send(`Invalid User, please try again`);

            let Embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setImage(`https://some-random-api.ml/canvas/gay?avatar=${Member.user.displayAvatarURL({ format: "png" })}`)
                .setFooter(`GAY 🏳️‍🌈`)
                .setTimestamp();

            return message.channel.send(Embed);
    }
}
