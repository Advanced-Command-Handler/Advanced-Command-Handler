import {ButtonStyle, ChannelType, ComponentType, TextInputStyle} from 'discord-api-types/v10';
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
				style: TextInputStyle.Paragraph,
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

			builder.addRow(row => row.setChannelSelectMenu({
				customId: 'b',
				defaultChannel: ctx.channel,
				channelTypes: [ChannelType.GuildText],
			}));

			// Reply to the interaction
			await ctx.reply({
				content: `You provided the argument: ${argument}`,
				components: builder,
			});

			ctx.onButtonClick({
				timeout: 60_000,
				count: 1,
			}, async interaction => await interaction.reply('Button clicked.'));

			ctx.onSelectMenuSelect({
				timeout: 60_000,
				count: 1,
			}, async interaction => await interaction.reply(`Select menu selected: ${interaction.channels.map(c => c.isDMBased() ? c.id : c.name).join(', ')}`));

			ctx.onSelectMenuSelect({
					type: ComponentType.ChannelSelect,
					timeout: 60_000,
					count: 1,
				},
				async interaction => {
					await interaction.message.edit({
						components: [],
					});

					const channels = interaction.channels.map(c => c.isDMBased() ? c.id : c.name).join(', ');
					await interaction.reply(`Channel select menu selected: ${channels}`);
				},
			);
		});
	}
}
