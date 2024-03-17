import {ContextMenuCommandBuilder, SlashCommandBuilder} from '@discordjs/builders';
import {ApplicationCommandType, type RESTPostAPIChatInputApplicationCommandsJSONBody} from 'discord-api-types/v10';
import {Logger} from '../../helpers/Logger.js';
import type {MessageCommand} from './MessageCommand.js';
import type {SlashCommand} from './SlashCommand.js';
import type {UserCommand} from './UserCommand.js';

/**
 * Builds a message command.
 *
 * @param command - The command to build.
 * @returns The built command.
 */
export function buildMessageCommand(command: MessageCommand): RESTPostAPIChatInputApplicationCommandsJSONBody {
	return new ContextMenuCommandBuilder()
		.setName(command.name)
		.setType(ApplicationCommandType.Message)
		.toJSON() as RESTPostAPIChatInputApplicationCommandsJSONBody;
}

/**
 * Builds a slash command.
 *
 * @param command - The command to build.
 * @returns The built command.
 */
export function buildSlashCommand(command: SlashCommand): RESTPostAPIChatInputApplicationCommandsJSONBody {
	const argumentsAsJSONs = Object.entries(command.arguments)
		.filter(([name, arg]) => {
			if (!arg.canBeSlashCommandArgument()) {
				Logger.warn(
					`Argument ${Logger.setColor('blue', name)} of command ${Logger.setColor('green', command.name)} can't be used as a slash command argument.`
				);
				return false;
			}

			return true;
		})
		.map(([name, argument]) => argument.toSlashCommandArgument!(name));

	const commandBuilder = new SlashCommandBuilder()
		.setName(command.name)
		.setDescription(command.description)
		.toJSON() as RESTPostAPIChatInputApplicationCommandsJSONBody;

	console.log('commandBuilder', {
		...commandBuilder,
		options: argumentsAsJSONs,
	});

	return {
		...commandBuilder,
		options: argumentsAsJSONs,
	};
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
