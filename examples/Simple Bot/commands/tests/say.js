const {Command, argError} = require('advanced-command-handler');

module.exports = new Command(
	{
		aliases: ['speak'],
		description: 'Make the bot say something.',
		usage: 'say <text>',
		name: 'say',
		userPermissions: ['MANAGE_MESSAGES'],
	},
	async (handler, message, args) => {
		if (args.length > 0) message.channel.send(message.content);
		else return argError(message, 'You must specify text to say.', this);
	}
);
