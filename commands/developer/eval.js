const discord = require("discord.js")

module.exports = {
  name: "eval",
  aliases: ["ev"],
  category: "Developer",
  usage: "eval <code>",
  description: "eval code",
  run: async (client, message, args) => {
    	let user = ['704453481792143361'];
	if (!user.includes(message.author.id)) {
		return message.channel.send(`g`);
	}

	const clean = text => {
		if (typeof text === 'string')
			return text
				.replace(/`/g, '`' + String.fromCharCode(8203))
				.replace(/@/g, '@' + String.fromCharCode(8203));
		return text;
	};
	try {
		const code = args.slice().join(' ');
		let evaled = eval(code);

		if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

		message.channel.send(clean(evaled), { code: 'xl' });
	} catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`js\n${clean(err)}\n\`\`\``);
	}
}
};
