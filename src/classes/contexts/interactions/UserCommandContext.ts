import type {APIInteractionGuildMember} from 'discord-api-types/v9';
import {type CacheType, type CacheTypeReducer, type GuildMember, type User, UserContextMenuInteraction} from 'discord.js';
import type {UserCommand} from '../../interactions/UserCommand.js';
import {ApplicationCommandContext, type ApplicationCommandContextBuilder} from './ApplicationCommandContext.js';

/**
 * The options of the UserCommandContext.
 */
export interface UserCommandContextBuilder extends ApplicationCommandContextBuilder<UserCommand> {
	interaction: UserContextMenuInteraction;
	targetMember: GuildMember | null;
	targetUser: User;
}

/**
 * The context of a user command.
 */
export class UserCommandContext extends ApplicationCommandContext<UserCommand> {
	override interaction: UserContextMenuInteraction;

	/**
	 * The member that was targeted by the command.
	 */
	public targetMember: CacheTypeReducer<CacheType, GuildMember, APIInteractionGuildMember>;

	/**
	 * The user that was targeted by the command.
	 */
	public targetUser: User;

	/**
	 * Creates a new UserCommandContext.
	 *
	 * @param options - The options of the UserCommandContext.
	 */
	public constructor(options: UserCommandContextBuilder) {
		super(options);
		this.command = options.command;
		this.interaction = options.interaction;
		this.targetMember = options.targetMember;
		this.targetUser = options.targetUser;
	}
}
