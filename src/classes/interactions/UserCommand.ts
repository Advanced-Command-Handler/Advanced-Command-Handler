import {ContextMenuCommandBuilder} from '@discordjs/builders';
import {ApplicationCommandType} from 'discord-api-types/v10';
import type {UserCommandContext} from '../contexts/interactions/UserCommandContext.js';
import {ApplicationCommand} from './ApplicationCommand.js';

export abstract class UserCommand extends ApplicationCommand {
	public abstract override run(ctx: UserCommandContext): Promise<unknown>;

	/**
	 * Converts the user command to a JSON representation.
	 */
	public override toJSON() {
		return new ContextMenuCommandBuilder().setName(this.name).setType(ApplicationCommandType.User).toJSON();
	}
}
