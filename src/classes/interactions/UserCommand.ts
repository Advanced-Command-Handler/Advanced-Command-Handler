import type {UserCommandContext} from '../contexts/interactions/UserCommandContext.js';
import {ApplicationCommand} from './ApplicationCommand.js';
import {buildUserCommand} from './builder.js';

export abstract class UserCommand extends ApplicationCommand {
	public abstract override run(ctx: UserCommandContext): Promise<void>;

	/**
	 * Converts the user command to a JSON representation.
	 */
	public override toJSON() {
		return buildUserCommand(this);
	}
}
