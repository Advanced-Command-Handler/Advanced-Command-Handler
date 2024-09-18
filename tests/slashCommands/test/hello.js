import {SlashCommand, stringArgument} from 'advanced-command-handler';

export default class HelloSlashCommand extends SlashCommand {
	name = 'hello';
	description = 'Hello world command.';
	arguments = {
		thing: stringArgument({
			description: 'The thing to say hello to.',
		}),
	};

	async run(ctx) {
		const thing = ctx.argument('thing');
		await ctx.reply(`Hello world ${thing} !`);
	}
}
