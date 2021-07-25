import {
	APIMessage,
	APIMessageContentResolvable,
	Collection,
	DMChannel,
	EmojiIdentifierResolvable,
	Message,
	MessageAdditions,
	MessageOptions,
	MessageResolvable,
	SplitOptions,
	StringResolvable,
	TextChannel
} from 'discord.js';

import {Command} from '../commands';
import {CommandHandler} from '../../CommandHandler';
import { HelpCommand } from '../../defaults/commands';

/**
 * The interface to create a new CommandContext.
 */
export interface CommandContextBuilder {
	/**
	 * The arguments in the message.
	 */
	args: string[];
	/**
	 * The command.
	 */
	command: Command;
	/**
	 * The handler.
	 */
	handler: typeof CommandHandler;
	/**
	 * The message that executed the command.
	 */
	message: Message;
}

/**
 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/commands/context}
 */
export class CommandContext implements CommandContextBuilder {
	/**
	 * The arguments in the message.
	 */
	public args: string[];
	/**
	 * The command itself.
	 */
	public command: Command;
	/**
	 * The handler.
	 */
	public handler: typeof CommandHandler;
	/**
	 * The message that executed the command.
	 */
	public message: Message;

	/**
	 * Creates a new CommandContext associated to a Command.
	 *
	 * @param options - The options of the CommandContext.
	 */
	public constructor(options: CommandContextBuilder) {
		this.command = options.command;
		this.message = options.message;
		this.handler = options.handler;
		this.args = options.args;
	}

	/**
	 * Returns the arguments joined with a space between each.
	 */
	get argsString() {
		return this.args.join(' ');
	}

	/**
	 * Returns the channel where the command was executed.
	 */
	get channel() {
		return this.message.channel;
	}

	/**
	 * Returns the client.
	 */
	get client() {
		return this.handler.client!!;
	}

	/**
	 * Returns the name of the command executed.
	 */
	get commandName() {
		return this.command.name;
	}

	/**
	 * Returns the content of the message.
	 */
	get content() {
		return this.message.content;
	}

	/**
	 * Returns the guild of the message.
	 */
	get guild() {
		return this.message.guild;
	}

	/**
	 * Returns the member of the message, `null` if executed in private messages.
	 */
	get member() {
		return this.message.member;
	}

	/**
	 * Returns the channel where the command was executed as a TextChannel or undefined if it isn't'.
	 */
	 get textChannel() {
		return this.message.channel instanceof TextChannel ? this.message.channel : undefined;
	}

	/**
	 * Returns the prefix used in the message.
	 */
	get prefix() {
		return this.handler.getPrefixFromMessage(this.message)!!;
	}

	/**
	 * Returns the author of the message.
	 */
	get user() {
		return this.message.author;
	}

	/**
	 * Deletes the message with an optional timeout.
	 *
	 * @remarks In Discord.js v13 the timeout for the `delete` method will be removed, so this will be more useful in v13.
	 * @param timeout - The time to wait in milliseconds before deleting the message.
	 */
	public async deleteMessage(timeout: number = 0) {
		await this.message.delete({timeout});
	}

	/**
	 * Add one or multiple reactions to a message.
	 *
	 * @remarks React in the order of emoji used.
	 * @param emoji - The emoji to react with, can be custom or native.
	 */
	public async react(...emoji: EmojiIdentifierResolvable[]) {
		for (const e of emoji) {
			await this.message.react(e);
		}
	}

	/**
	 * Remove all the reactions.
	 */
	public async removeAllReactions() {
		await this.message.reactions.removeAll();
	}

	/**
	 * Remove one or multiple reactions from emojis.
	 *
	 * @param emojis - The list of emoji reactions to remove.
	 */
	public async removeReaction(...emojis: EmojiIdentifierResolvable[]) {
		for (const emoji of emojis) {
			await this.message.reactions.resolve(typeof emoji === 'object' ? emoji.id! : emoji)!.remove();
		}
	}

	/**
	 * Remove one or multiple reactions from the bot.
	 *
	 * @param emojis - The emojis the bot has to remove reaction from.
	 */
	public async removeSelfReaction(...emojis: EmojiIdentifierResolvable[]) {
		for (const e of emojis) {
			await this.message.reactions.resolve(typeof e === 'object' ? e.id! : e)!.users.remove(this.client.user!.id);
		}
	}

	/**
	 * Sends the help menu from the default `HelpCommand` command (even if you are not using it).
	 * 
	 * @returns - The message of the help menu.
	 */
	 public async sendGlobalHelpMessage() {
		return HelpCommand.sendGlobalHelp(this);
	}

	/**
	 * Sends the help menu of the command from the default `HelpCommand` command (even if you are not using it).
	 * 
	 * @param commandName - The name of the command to send the help menu.
	 * @returns - The message of the help menu of the command.
	 */
	public async sendHelpMessage(commandName = this.commandName) {
		return HelpCommand.sendCommandHelp(this, this.handler.commands.get(commandName)!!);
	}

	public bulkDeleteInChannel(number: number, filterOld?: boolean): Promise<Collection<string, Message>>;
	public bulkDeleteInChannel(number: Collection<string, Message>, filterOld?: boolean): Promise<Collection<string, Message>>;
	public bulkDeleteInChannel(number: readonly MessageResolvable[], filterOld?: boolean): Promise<Collection<string, Message>>;
	/**
	 * Delete multiple messages from a channel.
	 *
	 * @param number - The number of messages to delete, or a collection of messages, or an array of Messages or IDs.
	 * @param filterOld - Filter messages to remove those, which are older than two weeks automatically.
	 * @returns - The collection of the deleted messages.
	 */
	public async bulkDeleteInChannel(number: number | Collection<string, Message> | readonly MessageResolvable[], filterOld?: boolean) {
		if (!(this.channel instanceof DMChannel)) {
			return this.channel.bulkDelete(number, filterOld);
		}
	}

	public send(content: APIMessageContentResolvable | (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message>;
	public send(options: MessageOptions & {split: true | SplitOptions}): Promise<Message[]>;
	public send(options: MessageOptions | APIMessage): Promise<Message | Message[]>;
	public send(content: StringResolvable, options: (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message>;
	public send(content: StringResolvable, options: MessageOptions & {split: true | SplitOptions}): Promise<Message[]>;
	public send(content: StringResolvable, options: MessageOptions): Promise<Message | Message[]>;
	/**
	 * Send a message in the channel.
	 *
	 * @param content - The content, or embed, or object with an embed/content/attachments.
	 * @param options - The options.
	 * @returns - The message sent.
	 */
	public send(
		content: StringResolvable,
		options?: MessageOptions | (MessageOptions & {split?: boolean | SplitOptions}) | MessageAdditions
	): Promise<Message | Message[]> {
		return this.channel.send(content, options as any);
	}

	public reply(content: APIMessageContentResolvable | (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message>;
	public reply(options: MessageOptions & {split: true | SplitOptions}): Promise<Message[]>;
	public reply(options: MessageOptions | APIMessage): Promise<Message | Message[]>;
	public reply(content: StringResolvable, options: (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message>;
	public reply(content: StringResolvable, options: MessageOptions & {split: true | SplitOptions}): Promise<Message[]>;
	/**
	 * Reply to the message in the channel.
	 *
	 * @param content - The content, or embed, or object with an embed/content/attachments.
	 * @param options - The options.
	 * @returns - The message sent.
	 */
	public reply(content: StringResolvable, options?: MessageOptions | (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message | Message[]> {
		return this.message.reply(content, options as any);
	}
}
