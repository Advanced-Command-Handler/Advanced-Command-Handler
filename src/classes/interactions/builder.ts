import {SlashCommandBuilder} from '@discordjs/builders';
import type {RESTPostAPIChatInputApplicationCommandsJSONBody} from 'discord-api-types/v10';
import type {SlashCommand} from './SlashCommand.js';

/**
 *
 * @param command
 * @returns
 */
export function buildSlashCommand(command: SlashCommand): RESTPostAPIChatInputApplicationCommandsJSONBody {
	return new SlashCommandBuilder().setName(command.name).setDescription(command.description).toJSON() as RESTPostAPIChatInputApplicationCommandsJSONBody;
}
