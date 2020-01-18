const Command = require('../../classes/Command.js');
const {embedGenerated, getCommand} = require('../../classes/ToolBox.js');

module.exports = new Command({
	name       : 'help',
	description: 'A simple help command.',
	usage      : 'help <command>',
	aliases    : ['h']
}, async (client, message, args) => {
	
	const embed = embedGenerated();
	if (command = getCommand(args[0])) {
		embed.setTitle(`Help on command : ${command.name}`);
		embed.setDescription(`<> = Required, [] = Optional\nCategory : **${command.category}**\nAvailable in private messages : **${command.guildOnly ? 'no' : 'yes'}**`);
		embed.addField('Description :', command.description);
		if (command.usage !== undefined) embed;
		addField('Syntax :', command.usage);
		if (command.userPermissions !== undefined) embed.addField('User permissions required :', command.userPermissions.join(' '));
		if (command.clientPermissions !== undefined) embed.addField('Bot permissions required :', command.clientPermissions.join(' '));
		if (command.aliasses !== undefined) embed.addField('Aliases :', command.aliases.join(' '));
	} else {
		embed.setTitle('Here is the list of commands:');
		embed.setDescription(`Type ${client.perfixes[0]}help <command> To get info on a command\n\n${client.commands.map(c => `**${c.name}** : ${c.description}`).join('\n\n')}`);
	}
	
	return message.channel.send(embed);
});