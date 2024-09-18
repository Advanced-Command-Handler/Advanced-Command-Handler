import {stringArgument} from '../../classes/arguments/arguments.js';
import type {SlashCommandContext} from '../../classes/contexts/interactions/SlashCommandContext.js';
import {SlashCommand} from '../../classes/interactions/SlashCommand.js';

export class SubTestSlashCommand extends SlashCommand {
	public override readonly description = 'A test command.';
	public override readonly name = 'sub';

	public override async run(ctx: SlashCommandContext) {
		await ctx.reply(`Test command with sub!`);
	}

	public override registerSubCommands() {
		this.subCommand(
			'sub',
			{
				description: 'A test sub command.',
				arguments: {
					test: stringArgument({
						description: 'A test argument.',
					}),
				},
			},
			async ctx => {
				console.log(ctx.arguments, ctx.interaction.options.data);
				const argument = ctx.argument<string>('test');
				await ctx.reply(`Test sub command! ${argument}`);
			}
		);
	}
}
