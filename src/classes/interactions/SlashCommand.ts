import {SlashCommandBuilder} from '@discordjs/builders';
import type {RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v9';
import {type PermissionString, Permissions} from 'discord.js';
import {Logger} from '../../helpers/Logger.js';
import type {SlashCommandArgument} from '../arguments/SlashCommandArgument.js';
import type {SlashCommandContext} from '../contexts/interactions/SlashCommandContext.js';
import {ApplicationCommand} from './ApplicationCommand.js';

export abstract class SlashCommand extends ApplicationCommand {
	/**
	 * The arguments of the command.
	 * You can put your own custom arguments, but you must add the type to the {@link ArgumentType | argument types}.
	 */
	public arguments: Record<string, SlashCommandArgument<any>> = {};
	/**
	 * The description of the slash command.
	 */
	public abstract readonly description: string;
	public readonly guilds: string[] = [];
	public readonly nsfw: boolean = false;
	public readonly userPermissions: PermissionString[] = [];

	public abstract override run(ctx: SlashCommandContext): Promise<void>;

	public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
		const commandsJSONBody = new SlashCommandBuilder().setName(this.name).setDescription(this.description).setNSFW(this.nsfw);

		if (this.userPermissions.length > 0) {
			commandsJSONBody.setDefaultMemberPermissions(
				this.userPermissions
					.map(name => {
						try {
							return Permissions.resolve(name);
						} catch (e) {
							Logger.warn(`Permission ${Logger.setColor('orange', name)} is not valid: ${e instanceof Error ? e.message : e ?? ''}`);
							return 0n;
						}
					})
					.reduce((a, b) => a | b, 0n)
			);
		}
		return commandsJSONBody.toJSON();
	}
}
