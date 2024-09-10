import type {APIInteractionGuildMember} from 'discord-api-types/v9';
import {
	type CacheType,
	type CacheTypeReducer,
	type CommandInteraction,
	type GuildCacheMessage,
	type GuildMember,
	type InteractionReplyOptions,
	MessageEmbed,
} from 'discord.js';
import type {InteractionHandler} from '../../../InteractionHandler.js';
import type {SlashCommand} from '../../interactions/SlashCommand.js';

interface ReplyOptions extends InteractionReplyOptions {
	embed?: MessageEmbed;
}

/**
 * The options of the SlashCommandContext.
 */
interface SlashCommandContextBuilder {
	/**
	 * The slash command that was executed.
	 */
	command: SlashCommand;
	/**
	 * The interaction that represents the slash command.
	 */
	interaction: CommandInteraction;
	/**
	 * The handler that handled the slash command.
	 */
	interactionHandler: typeof InteractionHandler;
}

/**
 * The context of a slash command.
 */
export class SlashCommandContext {
	/**
	 * The slash command that was executed.
	 */
	public command: SlashCommand;

	/**
	 * The interaction that represents the slash command.
	 */
	public interaction: CommandInteraction;

	/**
	 * The handler that handled the slash command.
	 */
	public interactionHandler: typeof InteractionHandler;

	/**
	 * Creates a new SlashCommandContext.
	 *
	 * @param options - The options of the SlashCommandContext.
	 */
	public constructor(options: SlashCommandContextBuilder) {
		this.command = options.command;
		this.interaction = options.interaction;
		this.interactionHandler = options.interactionHandler;
	}

	/**
	 * The channel where the slash command was executed.
	 */
	get channel() {
		return this.interaction.channel;
	}

	/**
	 * The client that handled the slash command.
	 */
	get client() {
		return this.interactionHandler.client!;
	}

	/**
	 * The description of the command that was executed.
	 */
	get commandDescription() {
		return this.command.description;
	}

	/**
	 * The name of the command that was executed.
	 */
	get commandName() {
		return this.command.name;
	}

	/**
	 * The guild where the slash command was executed.
	 */
	get guild() {
		return this.interaction.guild;
	}

	/**
	 * The id of the command that was executed.
	 */
	get id() {
		return this.interaction.id;
	}

	/**
	 * The member who executed the slash command.
	 */
	get member(): CacheTypeReducer<CacheType, GuildMember, APIInteractionGuildMember> {
		// @ts-expect-error Version mismatch.
		return this.interaction.member;
	}

	/**
	 * The options of the command that was executed.
	 */
	get options() {
		return this.interaction.options;
	}

	/**
	 * The token of the command that was executed.
	 */
	get token() {
		return this.interaction.token;
	}

	/**
	 * The user who executed the slash command.
	 */
	get user() {
		return this.interaction.user;
	}

	/**
	 * Defer the reply of the slash command.
	 */
	public async defer() {
		await this.interaction.deferReply();
	}

	/**
	 *
	 */
	public reply(options: ReplyOptions): Promise<(typeof options)['fetchReply'] extends true ? GuildCacheMessage<CacheType> : void>;
	/**
	 *
	 */
	public reply(content: string): Promise<void>;
	/**
	 *
	 */
	public reply(content: string, options: ReplyOptions): Promise<(typeof options)['fetchReply'] extends true ? GuildCacheMessage<CacheType> : void>;
	/**
	 * Reply to the slash command.
	 *
	 * @param content - The options of the reply.
	 * @param options - The options of the reply message.
	 * @returns The message that was sent.
	 */
	public async reply(
		content: string | ReplyOptions,
		options?: ReplyOptions
	): Promise<typeof options extends ReplyOptions ? ((typeof options)['fetchReply'] extends true ? GuildCacheMessage<CacheType> : void) : void> {
		const finalOptions: ReplyOptions = typeof content === 'string' ? {content} : content;
		if (options) {
			if (options.embed && !options.embeds) options.embeds = [options.embed];
			options.fetchReply = true;
			Object.assign(finalOptions, options);
		}

		return this.interaction.reply(finalOptions);
	}
}
