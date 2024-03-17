import {stringArgument} from '../../classes/arguments/arguments.js';
import type {SlashCommandContext} from '../../classes/contexts/interactions/SlashCommandContext.js';
import {SlashCommand} from '../../classes/interactions/SlashCommand.js';

export class TestSlashCommand extends SlashCommand {
	public override arguments = {
		test: stringArgument({
			description: 'A test argument.',
		}),
	};
	public override readonly description = 'A test command.';
	public override readonly name = 'test';

	public override async run(ctx: SlashCommandContext) {
		const argument = ctx.argument<string>('test');
		await ctx.reply(`Test command! Argument: ${argument}`);
	}
}
