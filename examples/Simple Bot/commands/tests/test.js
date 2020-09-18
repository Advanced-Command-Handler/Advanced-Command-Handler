const {Command} = require('advanced-command-handler');

module.exports = new Command(
	{
		name: 'test',
		description: 'A simple test command',
		aliases: ['t'],
		ownerOnly: true,
		guildOnly: true,
		clientPermissions: ['MANAGE_GUILD'],
		cooldown: 5,
	},
	async (client, message) => {
		message.channel.send('Hello, Discord!');
	}
);
