import {SlashCommand, SlashCommandContext} from '../../classes/index.js';

export class TestSlashCommand extends SlashCommand {
	public override readonly name = 'test';
	public override readonly description = 'A test command.';

	public override async run(ctx: SlashCommandContext) {
		await ctx.reply('Test command!');
	}
}
