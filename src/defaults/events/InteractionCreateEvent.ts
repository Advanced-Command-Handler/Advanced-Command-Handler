import {type Interaction} from 'discord.js';
import {EventContext} from '../../classes/contexts/EventContext.js';
import {MessageCommandContext} from '../../classes/contexts/interactions/MessageCommandContext.js';
import {SlashCommandContext} from '../../classes/contexts/interactions/SlashCommandContext.js';
import {SubSlashCommandContext} from '../../classes/contexts/interactions/SubSlashCommandContext.js';
import {UserCommandContext} from '../../classes/contexts/interactions/UserCommandContext.js';
import {Event} from '../../classes/Event.js';
import {MessageCommand} from '../../classes/interactions/MessageCommand.js';
import {SlashCommand} from '../../classes/interactions/SlashCommand.js';
import {UserCommand} from '../../classes/interactions/UserCommand.js';

export class InteractionCreateEvent extends Event {
	override readonly name = 'interactionCreate';

	/**
	 * Configures slash commands to be executed when an interaction is created.

	 * @param ctx - The event context.
	 * @param interaction - The interaction that was created.
	 * @returns The result of the command execution.
	 */
	public override async run(ctx: EventContext<this>, interaction: Interaction) {
		if (!interaction.isApplicationCommand()) return;
		const command = ctx.interactionHandler.commands.find(cmd => {
			if (interaction.isMessageContextMenu()) return cmd instanceof MessageCommand && cmd.name === interaction.commandName;
			if (interaction.isCommand()) return cmd instanceof SlashCommand && cmd.name === interaction.commandName;
			if (interaction.isUserContextMenu()) return cmd instanceof UserCommand && cmd.name === interaction.commandName;
			return false;
		});
		if (!command) return;

		if (command instanceof MessageCommand && interaction.isMessageContextMenu()) {
			const message = await interaction.channel!.messages.fetch(interaction.targetId);
			const commandContext = new MessageCommandContext({
				interaction,
				interactionHandler: ctx.interactionHandler,
				command,
				targetMessage: message,
			});
			await command.run(commandContext);
		} else if (command instanceof SlashCommand && interaction.isCommand()) {
			const subCommandName = interaction.options.getSubcommand(false);
			if (subCommandName) {
				const subCommand = command.subCommands.find(subCmd => subCmd.name === subCommandName);
				if (!subCommand) return;
				const commandContext = new SubSlashCommandContext({
					interaction,
					interactionHandler: ctx.interactionHandler,
					command,
					subCommand,
				});
				await subCommand.run(commandContext);
				return;
			}

			const commandContext = new SlashCommandContext({
				interaction,
				interactionHandler: ctx.interactionHandler,
				command,
			});
			await command.run(commandContext);
		} else if (command instanceof UserCommand && interaction.isUserContextMenu()) {
			const member = interaction.inGuild() ? await interaction.guild!.members.fetch(interaction.targetId) : null;

			const commandContext = new UserCommandContext({
				interaction,
				interactionHandler: ctx.interactionHandler,
				command,
				targetMember: member,
				targetUser: interaction.targetUser,
			});
			await command.run(commandContext);
		}
	}
}
