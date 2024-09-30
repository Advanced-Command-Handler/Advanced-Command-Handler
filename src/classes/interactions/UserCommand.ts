import {type RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v10';
import {ContextMenuCommandBuilder} from 'discord.js';
import type {UserCommandContext} from '../contexts/interactions/UserCommandContext.js';
import {ApplicationCommand} from './ApplicationCommand.js';

export abstract class UserCommand extends ApplicationCommand {
	public abstract override run(ctx: UserCommandContext): Promise<unknown>;

	/**
	 * Converts the user command to a JSON representation.
	 */
	public override toJSON(): RESTPostAPIApplicationCommandsJSONBody {
		return new ContextMenuCommandBuilder().setName(this.name).setType(2).toJSON();
	}
}
