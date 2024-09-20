import {intArgument, stringArgument} from '../../classes/arguments/arguments.js';
import {SlashCommand} from '../../classes/interactions/SlashCommand.js';

export class ComplexSubSlashCommandTest extends SlashCommand {
	public override readonly description = 'A complex test command with subcommand groups.';
	public override readonly name = 'complex';

	public override registerSubCommands() {
		// First subcommand group
		const group1 = this.subGroup('group1', 'First test subcommand group.');
		group1.subCommand('command1', {
			description: 'First command in the first group.',
			arguments: {
				arg1: stringArgument({
					description: 'A test argument for command1.',
				}),
			},
		}, async ctx => {
			const argument = ctx.argument('arg1');
			await ctx.reply(`Group1 Command1 executed with argument: ${argument}`);
		});

		group1.subCommand('command2', {
			description: 'Second command in the first group.',
			arguments: {
				arg1: intArgument({
					description: 'A test argument for command2.',
				}),
			},
		}, async ctx => {
			const argument = ctx.argument('arg1');
			await ctx.reply(`Group1 Command2 executed with argument: ${argument}`);
		});

		// Second subcommand group
		const group2 = this.subGroup('group2', 'Second test subcommand group.');
		group2.subCommand('command1', {
			description: 'First command in the second group.',
			arguments: {
				arg2: intArgument({
					description: 'A test argument for command2.',
				}),
			},
		}, async ctx => {
			const argument = ctx.argument('arg2');
			await ctx.reply(`Group2 Command2 executed with argument: ${argument}`);
		});

		group2.subCommand('simple', {
			description: 'Simple command in the second group.',
		}, async ctx => await ctx.reply('Group2 Simple command executed.'));
	}
}
