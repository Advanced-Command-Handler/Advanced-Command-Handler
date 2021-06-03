import {APIMessage, APIMessageContentResolvable, EmojiIdentifierResolvable, Message, MessageAdditions, MessageOptions, SplitOptions, StringResolvable} from 'discord.js';
import {CommandHandler} from '../../CommandHandler';
import {Command} from '../commands';

export interface CommandContextBuilder {
	args: string[];
	command: Command;
	handler: typeof CommandHandler;
	message: Message;
}

export class CommandContext implements CommandContextBuilder {
	public args: string[];
	public command: Command;
	public handler: typeof CommandHandler;
	public message: Message;

	public constructor(options: CommandContextBuilder) {
		this.command = options.command;
		this.message = options.message;
		this.handler = options.handler;
		this.args = options.args;
	}

	get argsString() {
		return this.args.join(' ');
	}

	get channel() {
		return this.message.channel;
	}

	get client() {
		return this.handler.client!!;
	}

	get commandName() {
		return this.command.name;
	}

	get content() {
		return this.message.content;
	}

	get guild() {
		return this.message.guild;
	}

	get member() {
		return this.message.member;
	}

	get prefix(): string {
		return this.handler.getPrefixFromMessage(this.message)!!;
	}

	get user() {
		return this.message.author;
	}

	public async react(emoji: EmojiIdentifierResolvable) {
		return await this.message.react(emoji);
	}

	public async removeReactions() {
		return this.message.reactions.removeAll();
	}

	public async removeReaction(emoji: EmojiIdentifierResolvable) {
		return this.message.reactions.resolve(typeof emoji === 'object' ? emoji.id! : emoji)!.remove();
	}

	public async removeSelfReaction(emoji: EmojiIdentifierResolvable) {
		return this.message.reactions.resolve(typeof emoji === 'object' ? emoji.id! : emoji)!.users.remove(this.client.user!.id);
	}

	public deleteMessage(timeout: number = 0) {
		return this.message.delete({timeout});
	}

	public send(content: APIMessageContentResolvable | (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message>;
	public send(options: MessageOptions & {split: true | SplitOptions}): Promise<Message[]>;
	public send(options: MessageOptions | APIMessage): Promise<Message | Message[]>;
	public send(content: StringResolvable, options: (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message>;
	public send(content: StringResolvable, options: MessageOptions & {split: true | SplitOptions}): Promise<Message[]>;
	public send(content: StringResolvable, options: MessageOptions): Promise<Message | Message[]>;
	public send(content: StringResolvable, options?: MessageOptions | (MessageOptions & {split?: boolean | SplitOptions}) | MessageAdditions): Promise<Message | Message[]> {
		return this.channel.send(content, options as any);
	}

	public reply(content: APIMessageContentResolvable | (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message>;
	public reply(options: MessageOptions & {split: true | SplitOptions}): Promise<Message[]>;
	public reply(options: MessageOptions | APIMessage): Promise<Message | Message[]>;
	public reply(content: StringResolvable, options: (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message>;
	public reply(content: StringResolvable, options: MessageOptions & {split: true | SplitOptions}): Promise<Message[]>;
	public reply(content: StringResolvable, options?: MessageOptions | (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message | Message[]> {
		return this.message.reply(content, options as any);
	}
}
