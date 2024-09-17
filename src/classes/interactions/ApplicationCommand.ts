import type {RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v9';
import type {ApplicationCommandContext} from '../contexts/interactions/ApplicationCommandContext.js';

export abstract class ApplicationCommand {
	/**
	 * The guilds option is not available for SubCommands.
	 */
	public readonly guilds: string[] = [];
	public abstract readonly name: string;

	public abstract run(ctx: ApplicationCommandContext): Promise<unknown>;

	public abstract toJSON(): RESTPostAPIApplicationCommandsJSONBody;
}
