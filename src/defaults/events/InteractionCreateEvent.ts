import {Interaction} from 'discord.js';
import {Event, EventContext, SlashCommandContext} from '../../classes/index.js';

export class InteractionCreateEvent extends Event {
	override readonly name = 'interactionCreate';

	public override async run(ctx: EventContext<this>, interaction: Interaction) {
		if (!interaction.isCommand()) return;
		const command = ctx.interactionHandler.commands.get(interaction.commandName);
		if (!command) return;
		const commandContext = new SlashCommandContext({
			interaction,
			interactionHandler: ctx.interactionHandler,
			command,
		});
		await command.run(commandContext);
	}
}
