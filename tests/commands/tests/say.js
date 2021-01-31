const {Command, Tag} = require('advanced-command-handler');
module.exports = new Command(
	{
		name: 'say',
		tags: [Tag.guildOnly],
		userPermissions: ['MANAGE_MESSAGES'],
		cooldown: 10,
	},
	async (handler, message, args) => {
		await message.channel.send(args.length ? args.join(' ') : 'You must specify a message.');
	}
);
