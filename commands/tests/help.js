const Command = require('../../classes/Command.js');
const getThing = require('../../utils/getThing.js');
const BetterEmbed = require('../../utils/BetterEmbeds.js');

module.exports = new Command({
	name       : 'help',
	description: 'A simple help command.',
	usage      : 'help <command>',
	aliases    : ['h']
}, async (client, message, args) => {
	
	const embed = new BetterEmbed();
	let command;
	if (command = await getThing('command', args[0])) {
		
		embed.title = `Help on command : ${command.name}`;
		embed.description = `<> = Required, [] = Optional\nCategory : **${command.category}**\nAvailable in private messages : **${command.guildOnly ? 'no' : 'yes'}**`;
		embed.fields.push({
			name : 'Description :',
			value: command.description
		});
		
		if (command.usage !== undefined) {
			embed.fields.push({
				name : 'Syntax :',
				value: command.usage
			});
		}
		if (command.userPermissions !== undefined) {
			embed.fields.push({
				name : 'User permissions required :',
				value: command.userPermissions.join(' ')
			});
		}
		if (command.clientPermissions !== undefined) {
			embed.fields.push({
				name : 'Bot permissions required :',
				value: command.clientPermissions.join(' ')
			});
		}
		if (command.aliases !== undefined) {
			embed.fields.push({
				name : 'Aliases :',
				value:
					command.aliases.join(' ')
			});
		}
		
	} else {
		embed.title = 'Here is the list of commands:';
		embed.description = `Type ${client.prefixes[0]}help <command> To get info on a command\n\n${client.commands.map(c => `**${c.name}** : ${c.description}`).join('\n\n')}`;
	}
	
	return message.channel.send(embed.build());
});