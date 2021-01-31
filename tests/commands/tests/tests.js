const {Command, Tag} = require('advanced-command-handler');
module.exports = new Command(
	{
		name: 'tests',
		aliases: ['test', 't'],
		channels: [],
		tags: [Tag.nsfw],
		userPermissions: ['MANAGE_MESSAGES'],
	},
	async (handler, message) => {
		await message.channel.send('testing');
	}
);
