const canvacord = require("canvacord")
const Discord = require("discord.js")

module.exports = {
    name: 'triggered',
    description: "Sends a Customized Change My Mind meme",
    usage: "triggered <Tag>",
    category: "meme",
    run: async(client, message, args) => {
        let avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await canvacord.Canvas.trigger(avatar);
        let attachment = new Discord.MessageAttachment(image, "triggered.gif");
        return message.channel.send(attachment)
    }
}