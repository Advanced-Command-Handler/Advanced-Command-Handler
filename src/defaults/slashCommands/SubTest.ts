import {enumArgument, intArgument, stringArgument} from '../../classes/arguments/arguments.js';
import {SlashCommand} from '../../classes/interactions/SlashCommand.js';

export class SubTestSlashCommand extends SlashCommand {
	public override readonly description = 'A test command.';
	public override readonly name = 'sub';

	public override registerSubCommands() {
		this.subCommand(
			'sub',
			{
				description: 'A test sub command.',
				arguments: {
					test: stringArgument({
						description: 'A test argument.',
					}),
					number: intArgument({
						description: 'A test number argument.',
						optional: true,
					}),
					enum: enumArgument({
						description: 'A test enum argument.',
						optional: true,
						values: {
							a: 'A',
							b: false,
							c: 5,
							d: ['a'],
						},
					}),
				},
			},
			async ctx => {
				const argument = ctx.argument('test');
				await ctx.reply(`Test sub command! ${argument}`);
			}
		);
	}
}
