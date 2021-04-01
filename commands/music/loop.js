const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
    name: "loop",
    description: "Pengulangan musik",
    usage: "loop",
    aliases: ["l"],
    category: "music",

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `🔁  **|**  The loop has been  **\`${serverQueue.loop === true ? "on" : "off"}\`**`
                }
            });
        };
    return sendError("There are no songs playing on this server.", message.channel);
  },
};
