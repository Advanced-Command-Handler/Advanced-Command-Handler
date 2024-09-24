import {ButtonStyle} from 'discord-api-types/v9';
import {stringArgument} from '../../classes/arguments/arguments.js';
import {ComponentsBuilder} from '../../classes/components/ComponentsBuilder.js';
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

	public override async run(ctx: SlashCommandContext<TestSlashCommand>) {
		const argument = ctx.argument('test');

		// Create message components
		const builder = new ComponentsBuilder();

		builder.addRow(row => row.addButton({
			label: 'Button',
			style: ButtonStyle.Primary,
			customId: 'button',
		}));

		builder.addRow(row => row.setStringSelectMenu({
			customId: 'a',
			options: [
				{
					label: 'mdr',
					value: 'a',
				}, {
					label: 'lol',
					value: 'b',
				},
			],
		}));

		builder.addRow(row => row.setChannelSelectMenu({
			customId: 'a',
			options: [
				{
					label: 'mdr',
					value: ctx.channel!,
				}, {
					label: 'lol',
					value: ctx.interaction.channelId,
				},
			],
		}));

		// Reply to the interaction
		await ctx.reply({
			content: `You provided the argument: ${argument}`,
			components: builder,
		});
	}
}
