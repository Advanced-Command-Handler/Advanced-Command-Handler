import {ButtonStyle} from 'discord-api-types/v9';
import {stringArgument} from '../../classes/arguments/arguments.js';
import {ComponentsBuilder} from '../../classes/components/ComponentsBuilder.js';
import {ModalComponent} from '../../classes/components/Modal.js';
import {SlashCommand} from '../../classes/interactions/SlashCommand.js';

export class ComponentsTest extends SlashCommand {
	public override readonly description = 'A test command.';
	public override readonly name = 'test';

	public override registerSubCommands() {
		this.subCommand('modal', {
			description: 'Test modals.',
		}, async ctx => {
			const modal = new ModalComponent('test', 'Test');
			modal.addTextInput({
				customId: 'test',
				label: 'Test',
			});

			modal.addTextInput({
				customId: 'test2',
				label: 'Test2',
				style: 'PARAGRAPH',
			});

			await ctx.showModal(modal);

			ctx.onModalSubmit(60_000,
				async interaction => await interaction.reply(`You provided the following values: ${interaction.values.join(', ')}`),
			);
		});

		this.subCommand('components', {
			description: 'Test components.',
			arguments: {
				test: stringArgument({
					description: 'A test argument.',
				}),
			},
		}, async ctx => {
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

			// Does not work on discord.js v13
			/* builder.addRow(row => row.setChannelSelectMenu({
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
			})); */

			// Reply to the interaction
			await ctx.reply({
				content: `You provided the argument: ${argument}`,
				components: builder,
			});
		});
	}
}
