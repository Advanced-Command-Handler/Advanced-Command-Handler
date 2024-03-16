import type {MessageCommandContext} from '../contexts/interactions/MessageCommandContext.js';
import {ApplicationCommand} from './ApplicationCommand.js';
import {buildMessageCommand} from './builder.js';

export abstract class MessageCommand extends ApplicationCommand {
	public abstract override run(ctx: MessageCommandContext): Promise<void>;

	/**
	 * Converts the message command to a JSON representation.
	 */
	public override toJSON() {
		return buildMessageCommand(this);
	}
}
