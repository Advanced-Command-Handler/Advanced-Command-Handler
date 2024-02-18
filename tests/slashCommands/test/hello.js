import {SlashCommand} from 'advanced-command-handler';

export default class HelloSlashCommand extends SlashCommand {
	name = 'hello';
	description = 'Hello world command.';

	async run(ctx) {
		await ctx.reply('Hello world !');
	}
}
