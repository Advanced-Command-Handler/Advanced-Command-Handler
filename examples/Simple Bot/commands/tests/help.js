const {BetterEmbed, Command, getThing} = require('advanced-command-handler');

module.exports = new Command(
	{
		name: 'help',
		description: 'A simple help command.',
		usage: 'help <command>',
		aliases: ['h'],
	},
	async (client, message, args) => {
		const embed = new BetterEmbed();
		let command;

		if (args[0]) {
			if ((command = await getThing('command', args[0]))) {
				embed.title = `Help on command : ${command.name}`;
				embed.description = `<> = Required, [] = Optional
Category : **${command.category}**
Available in private messages : **${command.guildOnly ? 'no' : 'yes'}**
${command.ownerOnly ? `**Only available to the owner(s).**` : ''}`;
				embed.fields.push({
					name: 'Description :',
					value: command.description,
				});

				if (command.usage) {
					embed.fields.push({
						name: 'Syntax :',
						value: command.usage,
					});
				}

				if (command.userPermissions) {
					embed.fields.push({
						name: 'User permissions required :',
						value: command.userPermissions.join(' '),
					});
				}

				if (command.clientPermissions) {
					embed.fields.push({
						name: 'Bot permissions required :',
						value: command.clientPermissions.join(' '),
					});
				}

				if (command.aliases) {
					embed.fields.push({
						name: 'Aliases :',
						value: command.aliases.join(' '),
					});
				}
			}
		} else {
			embed.title = 'Here is the list of commands:';
			embed.description = `Type ${client.handler.prefixes[0]}help <command> To get info on a command\n\n${client.handler.commands
				.map(c => `**${c.name}** : ${c.description}`)
				.sort()
				.join('\n\n')}`;
		}

		return message.channel.send({embed: embed.build()});
	}
);
