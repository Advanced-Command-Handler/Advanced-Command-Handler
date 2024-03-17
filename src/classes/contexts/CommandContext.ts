import {
	type Awaitable,
	BaseGuildTextChannel,
	Collection,
	type EmojiIdentifierResolvable,
	Message,
	MessageEmbed,
	type MessageOptions,
	type MessageResolvable,
	type ReplyMessageOptions,
	type StartThreadOptions,
} from 'discord.js';
import type {CommandHandler} from '../../CommandHandler.js';
import {ArgumentParser, type ArgumentResolved} from '../arguments/ArgumentParser.js';
import {CommandArgument} from '../arguments/CommandArgument.js';
import type {Command} from '../commands/Command.js';
import {CommandError} from '../errors/CommandError.js';

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
	/**
	 * The arguments in the message.
	 */
	rawArgs: string[];
}

/**
 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/commands/context}
 */
export class CommandContext implements CommandContextBuilder {
	/**
	 * The argument parser of this context, if the command has no arguments it will be undefined.
	 */
	public argumentParser?: ArgumentParser;
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
	 * The arguments in the message.
	 */
	public rawArgs: string[];

	/**
	 * Creates a new CommandContext associated to a Command.
	 *
	 * @param options - The options of the CommandContext.
	 */
	public constructor(options: CommandContextBuilder) {
		this.command = options.command;
		this.message = options.message;
		this.handler = options.handler;
		this.rawArgs = options.rawArgs;
	}

	/**
	 * The old list of raw arguments.
	 *
	 * @deprecated - Use {@link CommandContext#rawArgs} instead.
	 */
	get args() {
		return this.rawArgs;
	}

	/**
	 * Returns the arguments joined with a space between each.
	 */
	get argsString() {
		return this.rawArgs.join(' ');
	}

	/**
	 * Returns the list of arguments of the command.
	 */
	get arguments() {
		return Object.entries(this.command.arguments).map((a, index) => new CommandArgument(a[0], index, a[1]));
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
		return this.handler.client!;
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
		const longestAliasLength = Math.max(...aliases.map(a => a.split(/\s+/).length));
		return aliases.includes(this.rawArgs.slice(0, longestAliasLength).join(' '));
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
		return this.handler.getPrefixFromMessage(this.message)!;
	}

	/**
	 * Returns the channel where the command was executed as a TextChannel or undefined if it isn't.
	 */
	get textChannel() {
		return this.message.channel instanceof BaseGuildTextChannel ? this.message.channel : undefined;
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

	/**
	 * Returns an argument.
	 * If the argument is errored or not found it will return `null`.
	 *
	 * @typeParam T - The type of the argument.
	 * @param name - The name of the argument.
	 * @returns - The argument in a promise or null if the argument is not found or errored or the command has no arguments.
	 */
	public async argument<T>(name: string | keyof this['command']['arguments'] & string): Promise<T | null> {
		const result = await this.resolveArgument<T>(name);
		return result instanceof CommandError ? null : result ?? null;
	}

	/**
	 *
	 */
	public bulkDeleteInChannel(number: number, filterOld?: boolean): Promise<Collection<string, Message>>;
	/**
	 *
	 */
	public bulkDeleteInChannel(number: Collection<string, Message>, filterOld?: boolean): Promise<Collection<string, Message>>;
	/**
	 *
	 */
	public bulkDeleteInChannel(number: readonly MessageResolvable[], filterOld?: boolean): Promise<Collection<string, Message>>;
	/**
	 * Delete multiple messages from a channel.
	 *
	 * @param number - The number of messages to delete, or a collection of messages, or an array of Messages or IDs.
	 * @param filterOld - Filter messages to remove those, which are older than two weeks automatically.
	 * @returns - The collection of the deleted messages.
	 */
	public async bulkDeleteInChannel(number: number | Collection<string, Message> | readonly MessageResolvable[], filterOld?: boolean) {
		return this.textChannel?.bulkDelete(number, filterOld);
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
			return await new Promise<Message>(resolve => setTimeout(() => resolve(this.message.delete()), timeout));
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

	/**
	 *
	 */
	public reply(options: ReplyOptions): Promise<Message>;
	/**
	 *
	 */
	public reply(content: string): Promise<Message>;
	/**
	 *
	 */
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
		else if (content && options) {
			options.content = content;
		} else if (content && !options) options = {content};

		if (options && options.embed && !options.embeds) options.embeds = [options.embed];

		return this.message.reply(options ?? '');
	}

	/**
	 * Resolves one of the argument.
	 * If the argument is errored it will return a {@link CommandError}.
	 *
	 * @remarks Internally it uses {@link resolveArguments}.
	 * @typeParam T - The type of the argument.
	 * @param name - The name of the argument.
	 * @returns - The result of the argument maybe in a promise or undefined if no arguments with this name exists or the command has no arguments.
	 */
	public resolveArgument<T>(name: string | keyof this['command']['arguments'] & string): undefined | Awaitable<ArgumentResolved<T>> {
		if (this.argumentParser?.parsed) return this.argumentParser.parsed.get(name);
		return this.argumentParser?.resolveArgument(this, name);
	}

	/**
	 * Resolves all of the arguments of the command.
	 * If an argument has an error it will return a {@link CommandError}.
	 *
	 * @typeParam T - The type of the arguments as an union.
	 * @returns - A map of arguments or undefined if the command has no arguments.
	 */
	public async resolveArguments<A extends any[]>(): Promise<undefined | Map<string, ArgumentResolved<A[number]>>> {
		if (this.command.arguments) this.argumentParser = new ArgumentParser(this.arguments, this.rawArgs);
		return this.argumentParser?.resolveArguments(this);
	}

	/**
	 *
	 */
	public send(options: SendOptions): Promise<Message>;
	/**
	 *
	 */
	public send(content: string): Promise<Message>;
	/**
	 *
	 */
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
		else if (content && options) {
			options.content = content;
		} else if (content && !options) options = {content};

		if (options && options.embed && !options.embeds) options.embeds = [options.embed];

		return this.channel.send(options ?? '');
	}

	/**
	 * Sends the help menu from the default `HelpCommand` command (even if you are not using it).
	 *
	 * @returns - The message of the help menu.
	 */
	public async sendGlobalHelpMessage() {
		const {HelpCommand} = await import('../../defaults/commands/HelpCommand.js');
		return HelpCommand.sendGlobalHelp(this);
	}

	/**
	 * Sends the help menu of the command from the default `HelpCommand` command (even if you are not using it).
	 *
	 * @param commandName - The name of the command to send the help menu.
	 * @returns - The message of the help menu of the command.
	 */
	public async sendHelpMessage(commandName = this.commandName) {
		const {HelpCommand} = await import('../../defaults/commands/HelpCommand.js');
		return HelpCommand.sendCommandHelp(this, this.handler.commands.get(commandName)!);
	}
}
