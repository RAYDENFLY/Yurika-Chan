const { MessageEmbed } = require("discord.js");

function generateQueueEmbed(message, queue) {
  let embeds = [];
  let k = 10;

  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;

    const info = current.map((track) => `**\`${++j}\`** | [\`${track.title}\`](${track.url})`).join("\n");

module.exports = async (text, channel) => {
    let embed = new MessageEmbed()
    .setDescription(`${info}`)
    await channel.send(embed)
}

  }
}