import {type Interaction} from 'discord.js';
import {EventContext} from '../../classes/contexts/EventContext.js';
import {SlashCommandContext} from '../../classes/contexts/interactions/SlashCommandContext.js';
import {Event} from '../../classes/Event.js';

export class InteractionCreateEvent extends Event {
	override readonly name = 'interactionCreate';

	/**
	 * Configures slash commands to be executed when an interaction is created.

	 * @param ctx - The event context.
	 * @param interaction - The interaction that was created.
	 * @returns The result of the command execution.
	 */
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
