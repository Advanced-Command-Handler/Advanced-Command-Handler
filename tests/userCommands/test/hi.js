import {UserCommand} from 'advanced-command-handler';

export default class HiUserCommand extends UserCommand {
	name = 'hi';

	async run(ctx) {
		await ctx.reply('Hi !');
	}
}
