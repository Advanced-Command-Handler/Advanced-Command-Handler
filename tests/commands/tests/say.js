const {Command, Tag} = require('advanced-command-hander');
module.exports = new Command(
	{
		name: 'say',
		tags: [Tag.guildOnly],
		userPermissions: ['MANAGE_MESSAGES'],
	},
	async (handler, message, args) => {
		await message.channel.send(args.length ? args.join(' ') : 'You must specify a message.');
	}
);
