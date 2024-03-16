import {MessageCommand} from 'advanced-command-handler';

export default class WaveMessageCommand extends MessageCommand {
	name = 'wave';

	async run(ctx) {
		await ctx.reply(':wave: Hi !');
	}
}
