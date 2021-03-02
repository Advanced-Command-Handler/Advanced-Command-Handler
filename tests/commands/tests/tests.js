const {Command} = require('advanced-command-handler');
module.exports = new Command(
	{
		name: 'tests',
		aliases: ['test', 't'],
		channels: [],
		tags: ['nsfw'],
		userPermissions: ['MANAGE_MESSAGES'],
	},
	async (handler, message) => {
		message.channel.send('testing');
	}
);
