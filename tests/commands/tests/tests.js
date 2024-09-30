import {Command, Permissions} from 'advanced-command-handler';

export default class TestCommand extends Command {
	name = 'tests';
	aliases = ['test', 't'];
	tags = ['nsfw'];
	userPermissions = [Permissions.ManageMessages];

	async run(ctx) {
		await ctx.reply('testing');
	}
}
