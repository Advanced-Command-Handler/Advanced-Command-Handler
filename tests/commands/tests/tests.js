const util = require('util');
const {Command, Tag} = require('advanced-command-hander');
module.exports = new Command(
	{
		name: 'tests',
		aliases: ['test', 't'],
		channels: [],
		tags: [Tag.dmOnly],
		userPermissions: ['MANAGE_MESSAGES'],
	},
	async (handler, message) => {
		await message.channel.send(util.inspect(handler).slice(0, 2000));
	}
);
