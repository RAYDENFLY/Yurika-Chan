const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "invite",
    category: "utility",
    description: "invite",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
        .setTitle(`Invite Bot`)
        .setDescription("Link : [Link Invite](https://discordbotlist.com/bots/yurika-chan)")
       message.channel.send(embed)
    }
}