import type {APIInteractionGuildMember} from 'discord-api-types/v9';
import {
	BaseCommandInteraction,
	type CacheType,
	type CacheTypeReducer,
	type GuildCacheMessage,
	type GuildMember,
	type InteractionReplyOptions,
	MessageEmbed,
} from 'discord.js';
import type {InteractionHandler} from '../../../InteractionHandler.js';
import type {ApplicationCommand} from '../../interactions/ApplicationCommand.js';

export interface ReplyOptions extends InteractionReplyOptions {
	embed?: MessageEmbed;
}

/**
 * The options of the ApplicationCommandContext.
 */
export interface ApplicationCommandContextBuilder<T extends ApplicationCommand = ApplicationCommand> {
	/**
	 * The application command that was executed.
	 */
	command: T;
	/**
	 * The interaction that represents the command.
	 */
	interaction: BaseCommandInteraction;
	/**
	 * The handler that handled the command.
	 */
	interactionHandler: typeof InteractionHandler;
}

/**
 * The context of an application command.
 */
export class ApplicationCommandContext<T extends ApplicationCommand = ApplicationCommand> {
	/**
	 * The application command that was executed.
	 */
	public command: T;

	/**
	 * The interaction that represents the command.
	 */
	public interaction: BaseCommandInteraction;

	/**
	 * The handler that handled the command.
	 */
	public interactionHandler: typeof InteractionHandler;

	/**
	 * Creates a new SlashCommandContext.
	 *
	 * @param options - The options of the SlashCommandContext.
	 */
	public constructor(options: ApplicationCommandContextBuilder<T>) {
		this.command = options.command;
		this.interaction = options.interaction;
		this.interactionHandler = options.interactionHandler;
	}

	/**
	 * The channel where the command was executed.
	 */
	get channel() {
		return this.interaction.channel;
	}

	/**
	 * The client that handled the command.
	 */
	get client() {
		return this.interactionHandler.client!;
	}

	/**
	 * The name of the command that was executed.
	 */
	get commandName() {
		return this.command.name;
	}

	/**
	 * The guild where the command was executed.
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
	 * The member who executed the command.
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
	 * The user who executed the command.
	 */
	get user() {
		return this.interaction.user;
	}

	/**
	 * Defer the reply of the command.
	 */
	public async defer() {
		await this.interaction.deferReply();
	}

	/**
	 *
	 */
	public reply<T extends ReplyOptions>(options: T): Promise<T['fetchReply'] extends true ? GuildCacheMessage<CacheType> : void>;
	/**
	 *
	 */
	public reply(content: string): Promise<void>;
	/**
	 *
	 */
	public reply<T extends ReplyOptions>(content: string, options: T): Promise<T['fetchReply'] extends true ? GuildCacheMessage<CacheType> : void>;

	/**
	 * Reply to the command.
	 *
	 * @param content - The options of the reply.
	 * @param options - The options of the reply message.
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

		this.interaction.isRepliable();

		return this.interaction.reply(finalOptions);
	}
}
