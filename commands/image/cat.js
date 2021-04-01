const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "cat",
  description: "Random Cat Image and Fact",
  category: "Image",
  run: async (bot, message, args) => {
    
     const url = "https://some-random-api.ml/img/cat";
        const facts = "https://some-random-api.ml/facts/cat"

        let image, response;
        let fact, responses;
        try {
            response = await axios.get(url);
            image = response.data;

            responses = await axios.get(facts)
            fact = responses.data

        } catch (e) {
            return message.channel.send(`An error occured, please try again!`)
        }

        const embed = new MessageEmbed()
            .setTitle(`Random Cat Image and Fact`)
            .setColor(`#f3f3f3`)
            .setDescription(fact.fact)
            .setImage(image.link)
            .setTimestamp()
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())

        await message.channel.send(embed)
    }
}
