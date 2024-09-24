import {ButtonStyle} from 'discord-api-types/v9';
import {stringArgument} from '../../classes/arguments/arguments.js';
import {ComponentsBuilder} from '../../classes/components/ComponentsBuilder.js';
import {ModalComponent} from '../../classes/components/Modal.js';
import {SlashCommand} from '../../classes/interactions/SlashCommand.js';

export class ComponentsTest extends SlashCommand {
	public override arguments = {
		test: stringArgument({
			description: 'A test argument.',
		}),
	};
	public override readonly description = 'A test command.';
	public override readonly name = 'test';

	public override registerSubCommands() {
		console.log('registerSubCommands');

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
		});

		this.subCommand('components', {
			description: 'Test components.',
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
		});
	}
}
