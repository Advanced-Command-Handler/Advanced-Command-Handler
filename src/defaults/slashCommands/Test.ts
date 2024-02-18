import type {SlashCommandContext} from '../../classes/contexts/interactions/SlashCommandContext.js';
import {SlashCommand} from '../../classes/interactions/SlashCommand.js';

export class TestSlashCommand extends SlashCommand {
	public override readonly name = 'test';
	public override readonly description = 'A test command.';

	public override async run(ctx: SlashCommandContext) {
		await ctx.reply('Test command!');
	}
}
