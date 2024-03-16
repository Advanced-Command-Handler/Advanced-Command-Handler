import {ContextMenuCommandBuilder, SlashCommandBuilder} from '@discordjs/builders';
import {ApplicationCommandType, type RESTPostAPIChatInputApplicationCommandsJSONBody} from 'discord-api-types/v10';
import type {SlashCommand} from './SlashCommand.js';
import type {UserCommand} from './UserCommand.js';

/**
 * Builds a slash command.
 *
 * @param command - The command to build.
 * @returns The built command.
 */
export function buildSlashCommand(command: SlashCommand): RESTPostAPIChatInputApplicationCommandsJSONBody {
	return new SlashCommandBuilder().setName(command.name).setDescription(command.description).toJSON() as RESTPostAPIChatInputApplicationCommandsJSONBody;
}

/**
 * Builds a user command.
 *
 * @param command - The command to build.
 * @returns The built command.
 */
export function buildUserCommand(command: UserCommand): RESTPostAPIChatInputApplicationCommandsJSONBody {
	return new ContextMenuCommandBuilder()
		.setName(command.name)
		.setType(ApplicationCommandType.User)
		.toJSON() as RESTPostAPIChatInputApplicationCommandsJSONBody;
}
