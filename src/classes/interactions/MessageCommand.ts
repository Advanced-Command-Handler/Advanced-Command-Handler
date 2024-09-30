import {type RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v9';
import {ContextMenuCommandBuilder} from 'discord.js';
import type {MessageCommandContext} from '../contexts/interactions/MessageCommandContext.js';
import {ApplicationCommand} from './ApplicationCommand.js';

export abstract class MessageCommand extends ApplicationCommand {
	public abstract override run(ctx: MessageCommandContext): Promise<unknown>;

	/**
	 * Converts the message command to a JSON representation.
	 */
	public override toJSON(): RESTPostAPIApplicationCommandsJSONBody {
		return new ContextMenuCommandBuilder().setName(this.name).setType(3).toJSON();
	}
}
