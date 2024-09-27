import type {APIInteractionGuildMember} from 'discord-api-types/v9';
import type {CacheType, CacheTypeReducer, GuildMember, Interaction} from 'discord.js';

/**
 * The context of an interaction.
 */
export class InteractionContext<T extends Interaction> {
	/**
	 * @param interaction - The interaction that was executed.
	 */
	public constructor(public interaction: T) {
	}

	/**
	 * The channel where the command was executed.
	 */
	get channel() {
		return this.interaction.channel;
	}

	/**
	 * The guild where the command was executed.
	 */
	get guild() {
		return this.interaction.guild;
	}

	/**
	 * The id of the interaction that was executed.
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
}
