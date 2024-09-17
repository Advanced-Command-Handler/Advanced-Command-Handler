import {ContextMenuCommandBuilder} from '@discordjs/builders';
import {ApplicationCommandType} from 'discord-api-types/v9';
import type {MessageCommandContext} from '../contexts/interactions/MessageCommandContext.js';
import {ApplicationCommand} from './ApplicationCommand.js';

export abstract class MessageCommand extends ApplicationCommand {
	public abstract override run(ctx: MessageCommandContext): Promise<unknown>;

	/**
	 * Converts the message command to a JSON representation.
	 */
	public override toJSON() {
		return new ContextMenuCommandBuilder().setName(this.name).setType(ApplicationCommandType.Message).toJSON();
	}
}
