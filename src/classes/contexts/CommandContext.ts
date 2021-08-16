import {
	Collection,
	EmojiIdentifierResolvable,
	Message,
	MessageEmbed,
	MessageOptions,
	MessageResolvable,
	NewsChannel,
	ReplyMessageOptions,
	StartThreadOptions,
	TextChannel,
} from 'discord.js';

import {Command, CommandHandler} from '../../';
import {HelpCommand} from '../../defaults/commands';

interface ReplyOptions extends ReplyMessageOptions {
	embed?: MessageEmbed;
}

interface SendOptions extends MessageOptions {
	embed?: MessageEmbed;
}

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
	 * Returns true if the arguments are calling a SubCommand.
	 */
	get isCallingASubCommand() {
		const aliases = this.command.subCommandsNamesAndAliases;
		const longestAliasLength = Math.max(...aliases.map(a => a.split('s').length));
		return aliases.includes(this.args.slice(0, longestAliasLength).join(' '));
	}

	/**
	 * Returns the member of the message, `null` if executed in private messages.
	 */
	get member() {
		return this.message.member;
	}

	/**
	 * Returns the prefix used in the message.
	 */
	get prefix() {
		return this.handler.getPrefixFromMessage(this.message)!!;
	}

	/**
	 * Returns the channel where the command was executed as a TextChannel or undefined if it isn't.
	 */
	get textChannel() {
		return this.message.channel instanceof TextChannel || this.message.channel instanceof NewsChannel ? this.message.channel : undefined;
	}

	/**
	 * Returns the channel where the command was executed as a ThreadChannel or undefined if it isn't.
	 */
	get thread() {
		return this.message.channel.isThread() ? this.message.channel : undefined;
	}

	/**
	 * Returns the author of the message.
	 */
	get user() {
		return this.message.author;
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
		if (this.textChannel) {
			return this.textChannel.bulkDelete(number, filterOld);
		}
	}

	/**
	 * Create a Thread, returns undefined if already in a Thread.
	 *
	 * @param options - The options of the Thread.
	 * @returns - The resulting Thread.
	 */
	public createThread(options: StartThreadOptions) {
		if (this.channel.isThread()) return undefined;
		return this.message.startThread(options);
	}

	/**
	 * Deletes the message with an optional timeout.
	 *
	 * @param timeout - The time to wait in milliseconds before deleting the message.
	 * @returns - The deleted message.
	 */
	public async deleteMessage(timeout: number = 0) {
		if (timeout) {
			return await new Promise<Message>(resolve => {
				setTimeout(() => {
					resolve(this.message.delete());
				}, timeout);
			});
		} else return await this.message.delete();
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

	public reply(options: ReplyOptions): Promise<Message>;
	public reply(content: string): Promise<Message>;
	public reply(content: string, options: ReplyOptions): Promise<Message>;
	/**
	 * Reply to the message in the channel.
	 *
	 * @param content - The content, or embed, or object with an embed/content/attachments.
	 * @param options - The options.
	 * @returns - The message sent.
	 */
	public reply(content: string | ReplyMessageOptions, options?: ReplyOptions) {
		if (typeof content !== 'string') options = content;
		else if (content && options) options.content === content;
		else if (content && !options) options = {content};

		if (options && options.embed && !options.embeds) options.embeds = [options.embed];

		return this.message.reply(options ?? '');
	}

	public send(options: SendOptions): Promise<Message>;
	public send(content: string): Promise<Message>;
	public send(content: string, options: SendOptions): Promise<Message>;
	/**
	 * Send a message in the channel.
	 *
	 * @param content - The content, or embed, or object with an embed/content/attachments.
	 * @param options - The options.
	 * @returns - The message sent.
	 */
	public send(content: string | SendOptions, options?: SendOptions) {
		if (typeof content !== 'string') options = content;
		else if (content && options) options.content === content;
		else if (content && !options) options = {content};

		if (options && options.embed && !options.embeds) options.embeds = [options.embed];

		return this.channel.send(options ?? '');
	}

	/**
	 * Sends the help menu from the default `HelpCommand` command (even if you are not using it).
	 *
	 * @returns - The message of the help menu.
	 */
	public sendGlobalHelpMessage() {
		return HelpCommand.sendGlobalHelp(this);
	}

	/**
	 * Sends the help menu of the command from the default `HelpCommand` command (even if you are not using it).
	 *
	 * @param commandName - The name of the command to send the help menu.
	 * @returns - The message of the help menu of the command.
	 */
	public sendHelpMessage(commandName = this.commandName) {
		return HelpCommand.sendCommandHelp(this, this.handler.commands.get(commandName)!!);
	}
}
