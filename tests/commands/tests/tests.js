import {Command} from 'advanced-command-handler';

export default class TestCommand extends Command {
	name = 'tests';
	aliases = ['test', 't'];
	tags = ['nsfw'];
	userPermissions = ['MANAGE_MESSAGES'];

	async run(ctx) {
		await ctx.reply('testing');
	}
}
