const Discord = require('discord.js');//npm i discordjs@12.2.0 
const superagent = require('superagent'); //npm i superagent
const canvas = require('canvas')

module.exports = {
  name: "wasted",
  description: "Get the wasted of anywhere",
  category: "Filter",
  usage: "wasted <>",
  run: (client, message, args) => {
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

            if (!Member) return message.channel.send(`Invalid User, please try again`);

            let Embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setImage(`https://some-random-api.ml/canvas/wasted?avatar=${Member.user.displayAvatarURL({ format: "png" })}`)
                .setFooter(`Wasted`)
                .setTimestamp();

            return message.channel.send(Embed);
    }
}