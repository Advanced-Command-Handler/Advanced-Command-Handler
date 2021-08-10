const {Command} = require('advanced-command-handler');

module.exports = class SayCommand extends Command {
	name = 'say';
	tags = ['guildOnly'];
	userPermissions = ['MANAGE_MESSAGES'];
	cooldown = 10;

	async run(ctx) {
		await ctx.reply(ctx.args.length ? ctx.argsString : 'You must specify a message.');
	}
};
