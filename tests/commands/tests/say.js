import {Command, stringArgument} from 'advanced-command-handler';

export default class SayCommand extends Command {
	name = 'say';
	tags = ['guildOnly'];
	userPermissions = ['MANAGE_MESSAGES'];
	cooldown = 10;
	arguments = {
		text: stringArgument({coalescing: true}),
	};

	async run(ctx) {
		await ctx.reply(await ctx.argument('text'));
	}
}
