import {Command, Permissions, stringArgument} from 'advanced-command-handler';

export default class SayCommand extends Command {
	name = 'say';
	tags = ['guildOnly'];
	userPermissions = [Permissions.ManageMessages];
	cooldown = 10;
	arguments = {
		text: stringArgument({coalescing: true}),
	};

	async run(ctx) {
		await ctx.reply(await ctx.argument('text'));
	}
}
