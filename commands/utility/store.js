const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "store",
    category: "utility",
    description: "store",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
        .setTitle(`Official AMS Store`)
        .setDescription("Kuy join ke AMS Store.\nAMS Store menyediakan pembuatan bot discord degan harga yang murah, tertarik kuy join Link : [Link Join](https://discord.gg/9zR2HvbGAq)")
       message.channel.send(embed)
    }
}