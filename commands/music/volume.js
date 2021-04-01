const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {

    name: "volume",
    description: "Ubah volume lagu",
    usage: "[volume]",
    aliases: ["v", "vol"],
    category: "music",

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Maaf, tetapi Anda harus menggunakan voice untuk memutar musik!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Nothing is playing on this server.", message.channel);
    if (!serverQueue.connection) return sendError("Nothing is playing on this server.", message.channel);
    if (!args[0])return message.channel.send(`Current volume is: **${serverQueue.volume}**`);
     if(isNaN(args[0])) return message.channel.send(':notes: Just numbers!').catch(err => console.log(err));
    if(parseInt(args[0]) > 150 ||(args[0]) < 0) return sendError('You cannot set the volume to more than 150. or lower than 0',message.channel).catch(err => console.log(err));
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let xd = new MessageEmbed()
    .setDescription(`Saya setel volume ke: ** ${args[0] / 1} / 100**`)
    .setAuthor("Volume", client.user.displayAvatarURL(), 'https://discord.js.org')
    .setColor("BLUE")
    return message.channel.send(xd);
  },
};
