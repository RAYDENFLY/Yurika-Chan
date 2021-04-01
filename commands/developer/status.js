const db = require("quick.db")
const discord = require("discord.js")

module.exports = {
  name: "status",
  description: "Change the bot status",
  usage: "status <here>",
  category: "Developer",
  run: async (client, message, args) => {

    //OWNER ONLY COMMAND
    if(!message.author.id === "704453481792143361") {
      return message.channel.send("This command can only be used by owner")
    }
    //ARGUMENT
    if(!args.length) {
      return message.channel.send("Please give status message")
    }

 db.set(`status`, args.join(" "))
   await message.channel.send("Updated the bot status")
    process.exit(1);

  }
}