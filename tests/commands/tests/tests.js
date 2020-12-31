const {Command, Tag} = require('advanced-command-hander');
module.exports = new Command(
	{
		name: 'tests',
		aliases: ['test', 't'],
		channels: ['620663106250604546'],
		tags: [Tag.dmOnly],
		userPermissions: ['MANAGE_MESSAGES'],
	},
	async (handler, message) => {
		await message.channel.send("Working !");
	}
);
