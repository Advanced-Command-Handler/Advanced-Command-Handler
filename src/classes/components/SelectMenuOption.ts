import {type APIMessageComponentEmoji, ChannelType, ComponentType} from 'discord-api-types/v10';
import {type Channel, Role, Snowflake, User} from 'discord.js';

export type SelectMenuValueMap = {
	[ComponentType.ChannelSelect]: Channel | Snowflake;
	[ComponentType.MentionableSelect]: Role | User | Snowflake;
	[ComponentType.RoleSelect]: Role | Snowflake;
	[ComponentType.StringSelect]: string;
	[ComponentType.UserSelect]: User | Snowflake;
};

export interface SelectMenuOption {
	/**
	 * Whether this option should be already-selected by default.
	 */
	default?: boolean;
	/**
	 * The description to display for the option.
	 */
	description?: string;
	/**
	 * The emoji to display to the left of the option.
	 */
	emoji?: APIMessageComponentEmoji;
	/**
	 * The label to display for the option.
	 */
	label: string;
	/**
	 * The value that will be sent to interactions when this option is selected.
	 */
	value: SelectMenuValueMap[ComponentType.StringSelect];
}

export interface SelectMenuOptions {
	customId: string;
	disabled?: boolean;
	maxValues?: number;
	minValues?: number;
	placeholder?: string;
}

export interface SelectMenuChannelOptions {
	channelTypes?: (keyof typeof ChannelType | ChannelType)[];
	defaultChannel?: Channel | Snowflake;
}

export type SelectMenuMentionableOptions = SelectMenuRoleOptions & SelectMenuUserOptions;

export interface SelectMenuRoleOptions {
	defaultRole?: Role | Snowflake;
}

export interface SelectMenuUserOptions {
	defaultUser?: User | Snowflake;
}

export interface SelectMenuStringOptions {
	options: SelectMenuOption[];
}
