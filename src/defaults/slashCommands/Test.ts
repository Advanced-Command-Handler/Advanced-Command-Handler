import {ButtonStyle} from 'discord-api-types/v9';
import {stringArgument} from '../../classes/arguments/arguments.js';
import {MessageComponentBuilder} from '../../classes/components/MessageComponentBuilder';
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
		const builder = new MessageComponentBuilder();

		const row1 = builder.addRow();
		row1.addComponent(MessageComponentBuilder.createButton(ButtonStyle.Primary, 'Click me!', 'button1'));
		row1.addComponent(MessageComponentBuilder.createButton(ButtonStyle.Secondary, 'Don\'t click me', 'button2', undefined, true));

		const row2 = builder.addRow();
		const selectMenu = MessageComponentBuilder.createSelectMenu('select1', 'Choose an option');
		selectMenu.addOption('Option 1', 'opt1', 'This is option 1').addOption('Option 2', 'opt2', 'This is option 2');
		row2.addComponent(selectMenu);

		const components = builder.build();

		await ctx.reply({
			content: `Test command! Argument: ${argument}`,
			components: components,
		});
	}
}
