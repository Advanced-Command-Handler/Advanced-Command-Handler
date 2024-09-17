import {type GuildMember, type Message, MessageContextMenuInteraction, type User} from 'discord.js';
import type {MessageCommand} from '../../interactions/MessageCommand.js';
import {ApplicationCommandContext, type ApplicationCommandContextBuilder} from './ApplicationCommandContext.js';

/**
 * The options of the UserCommandContext.
 */
export interface MessageCommandContextBuilder extends ApplicationCommandContextBuilder<MessageCommand> {
	interaction: MessageContextMenuInteraction;
	targetMessage: Message;
}

/**
 * The context of a message command.
 */
export class MessageCommandContext extends ApplicationCommandContext<MessageCommand> {
	override interaction: MessageContextMenuInteraction;
	/**
	 * The author of the message that was targeted by the command.
	 */
	public targetAuthor: User;
	/**
	 * The member of the message that was targeted by the command.
	 */
	public targetMember: GuildMember | null;
	/**
	 * The message that was targeted by the command.
	 */
	public targetMessage: Message;

	/**
	 * Creates a new MessageCommandContext.
	 *
	 * @param options - The options of the MessageCommandContext.
	 */
	public constructor(options: MessageCommandContextBuilder) {
		super(options);
		this.command = options.command;
		this.interaction = options.interaction;
		this.targetMessage = options.targetMessage;
		this.targetMember = options.targetMessage.member;
		this.targetAuthor = options.targetMessage.author;
	}
}
