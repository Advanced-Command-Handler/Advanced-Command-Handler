import {ChannelType, ComponentType} from 'discord-api-types/v9';
import {type AnyChannel, Role, Snowflake, User} from 'discord.js';

export type SelectMenuValueMap = {
	[ComponentType.ChannelSelect]: AnyChannel | Snowflake;
	[ComponentType.MentionableSelect]: Role | User | Snowflake;
	[ComponentType.RoleSelect]: Role | Snowflake;
	[ComponentType.StringSelect]: string;
	[ComponentType.UserSelect]: User | Snowflake;
};

export interface SelectMenuOption<T extends keyof SelectMenuValueMap> {
	description?: string;
	label: string;
	value: SelectMenuValueMap[T];
}

export interface SelectMenuOptions<T extends keyof SelectMenuValueMap> {
	customId: string;
	disabled?: boolean;
	maxValues?: number;
	minValues?: number;
	options: SelectMenuOption<T>[];
	placeholder?: string;
}

export interface SelectMenuChannelOptions {
	channelTypes?: (keyof typeof ChannelType | ChannelType)[];
}
