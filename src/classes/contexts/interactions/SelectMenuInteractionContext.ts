import type {APIGuildMember, APIRole, APIUser} from 'discord-api-types/v10';
import {
	type AnySelectMenuInteraction,
	type APIChannel,
	Base,
	BaseChannel,
	type Channel,
	ChannelSelectMenuInteraction,
	Collection,
	type GuildMember,
	MentionableSelectMenuInteraction,
	Role,
	RoleSelectMenuInteraction,
	type StringSelectMenuInteraction,
	User,
	UserSelectMenuInteraction,
} from 'discord.js';
import {RepliableInteractionContext} from './RepliableInteractionContext.js';

export class SelectMenuInteractionContext<T extends AnySelectMenuInteraction> extends RepliableInteractionContext<T> {
	constructor(interaction: T) {
		super(interaction);
	}

	/**
	 * The components of the message that was replied to.
	 */
	public get components() {
		return this.interaction.message.components;
	}

	public get channels(): Collection<string, Channel> {
		if (this.interaction instanceof ChannelSelectMenuInteraction) {
			return this.interaction.channels.mapValues(channel => channel instanceof BaseChannel ? channel : this.interaction.client.channels.resolve(channel.id)!);
		}

		throw new Error('This interaction is not a ChannelSelectMenuInteraction');
	}

	/**
	 * The component that was selected.
	 */
	public get selectMenu() {
		return this.interaction.component;
	}

	/**
	 * The message that was replied to.
	 */
	public get message() {
		return this.interaction.message;
	}

	/**
	 * The list of raw values selected by the user.
	 */
	public get rawValues() {
		return this.interaction.values;
	}

	/**
	 * The list of values selected by the user.
	 */
	public get values() {
		if (this.interaction instanceof ChannelSelectMenuInteraction) {
			return this.interaction.channels.mapValues(channel => channel instanceof BaseChannel ? channel : this.interaction.client.channels.resolve(channel.id)!);
		} else if (this.interaction instanceof UserSelectMenuInteraction) {
			return this.interaction.users;
		} else if (this.interaction instanceof RoleSelectMenuInteraction) {
			return this.interaction.roles.mapValues(role => role instanceof Role ? role : this.interaction.guild!.roles.resolve(role.id)!);
		} else if (this.interaction instanceof MentionableSelectMenuInteraction) {
			const result = new Collection<string, APIGuildMember | GuildMember | APIRole | Role | APIUser | User>();
			return result.concat(this.interaction.roles).concat(this.interaction.users).concat(this.interaction.members);
		}

		return this.rawValues;
	}

	/**
	 * Remove all components from the message.
	 *
	 * @returns The message without components.
	 */
	public async removeComponents() {
		const message = this.interaction.message;
		if (!message) {
			throw new Error('The message is not available.');
		}
		
		return await message.edit({components: []});
	}
}
