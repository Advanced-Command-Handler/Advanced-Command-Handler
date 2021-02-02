import {Channel, Collection, Emoji, Guild, GuildChannel, GuildMember, Message, NewsChannel, Role, Snowflake, TextChannel, User} from 'discord.js';
import {Command} from '../classes/Command';
import {CommandHandler} from '../CommandHandler';

export enum DataType {
	command = 'command',
	channel = 'channel',
	guild = 'emote',
	member = 'guild',
	user = 'user',
	role = 'role',
	emote = 'emote',
	message = 'message',
}

/**
 * Finds a channel {@link https://discord.js/#/docs/main/stable/class/Channel} from the text, or the message content and returns null if nothing found.
 * It can find it from ID/name/mention.
 *
 * @param dataType - Channel {@link DataType.channel}.
 * @param text - A string or a Message to find dataType from.
 * @returns The Channel or null if not found.
 */
export async function getThing(dataType: DataType.channel | 'channel', text: string | Message): Promise<GuildChannel | null>;
/**
 * Finds a Command {@link Command} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/alias.
 *
 * @param dataType - Command {@link DataType.command}.
 * @param text - A string or a Message to find dataType from.
 * @returns The Command  or null if not found.
 */
export async function getThing(dataType: DataType.command | 'command', text: string | Message): Promise<Command | null>;
/**
 * Finds an Emoji {@link https://discord.js.org/#/docs/main/stable/class/Emoji} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/emoji itself/ID.
 *
 * @param dataType - Emote {@link DataType.emote}.
 * @param text - A string or a Message to find dataType from.
 * @returns The Emoji or null if not found.
 */
export async function getThing(dataType: DataType.emote | 'emote', text: string | Message): Promise<Emoji | null>;
/**
 * Finds a Guild {@link https://discord.js.org/#/docs/main/stable/class/Guild} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/ID.
 *
 * @param dataType - Guild {@link DataType.guild}.
 * @param text - A string or a Message to find dataType from.
 * @returns The Guild or null if not found.
 */
export async function getThing(dataType: DataType.guild | 'guild', text: string | Message): Promise<Guild | null>;
/**
 * Finds a GuildMember {@link https://discord.js.org/#/docs/main/stable/class/GuildMember} from the text, or the message content and returns null if nothing found.
 * It can find it from the username/ID/mention/nickname.
 *
 * @param dataType - Member {@link DataType.member}.
 * @param text - A string or a Message to find dataType from.
 * @returns The Guild or null if not found.
 */
export async function getThing(dataType: DataType.member | 'member', text: string | Message): Promise<GuildMember | null>;
/**
 * Finds a Message {@link https://discord.js.org/#/docs/main/stable/class/Message} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/ID/link.
 *
 * @param dataType - Message {@link DataType.message}.
 * @param text - A string or a Message to find dataType from.
 * @returns The Message or null if not found.
 */
export async function getThing(dataType: DataType.message | 'message', text: string | Message): Promise<Message | null>;
/**
 * Finds a Role {@link https://discord.js.org/#/docs/main/stable/class/Role} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/ID/mention.
 *
 * @param dataType - Role {@link DataType.role}.
 * @param text - A string or a Message to find dataType from.
 * @returns The Role or null if not found.
 */
export async function getThing(dataType: DataType.role | 'role', text: string | Message): Promise<Role | null>;
/**
 * Finds a User {@link https://discord.js.org/#/docs/main/stable/class/User} from the text, or the message content and returns null if nothing found.<br>
 * It can find it from the username/ID.
 *
 * @param dataType - User {@link DataType.user}.
 * @param text - A string or a Message to find dataType from.
 * @returns The User or null if not found.
 */
export async function getThing(dataType: DataType.user | 'user', text: string | Message): Promise<User | null>;
/**
 * Finds the data from a string or a Message and returns null if nothing found.
 *
 * @param dataType - The data type {@link DataType}.
 * @param text - A string or a Message to find dataType from.
 * @returns The Data found or null if not found.
 */
export async function getThing(
	dataType: DataType | keyof typeof DataType,
	text: string | Message
): Promise<Command | GuildChannel | TextChannel | NewsChannel | Guild | GuildMember | User | Role | Emoji | Message | null> {
	let message: Message | null;
	if (text instanceof Message) {
		message = text;
		text = text.content;
	} else message = null;

	const client = CommandHandler.client;
	switch (dataType) {
		case DataType.command:
			return CommandHandler.commands.find((c: Command) => c.name === text || (c.aliases && c.aliases.includes(text as string))) || null;

		case DataType.channel:
			return (
				message?.guild?.channels.cache.get(text) ||
				message?.mentions.channels.first() ||
				message?.guild?.channels.cache.find((c: GuildChannel) => c.name.toLowerCase().includes((text as string).toLowerCase()) && text.toString().length > 1) ||
				null
			);
		case DataType.guild:
			return client?.guilds.cache.get(text) || client?.guilds.cache.find((g: Guild) => g.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) || null;

		case DataType.member:
			return (
				message?.guild?.members.cache.get(text) ||
				message?.mentions?.members?.first() ||
				message?.guild?.members.cache.find(
					(m: GuildMember) =>
						(m.displayName.toLowerCase().includes((text as string).toLowerCase()) || m.user.username.toLowerCase().includes((text as string).toLowerCase())) && (text as string).length > 1
				) ||
				null
			);
		case DataType.user:
			return client?.users.cache.get(text) || client?.users.cache.find((u: User) => u.username.toLowerCase() === (text as string).toLowerCase()) || message?.mentions?.users.first() || null;

		case DataType.role:
			return (
				message?.guild?.roles.cache.get(text) ||
				message?.mentions.roles.first() ||
				message?.guild?.roles.cache.find((r: Role) => r.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ||
				null
			);
		case DataType.emote:
			return client?.emojis.cache.get(text) || client?.emojis.cache.find((e: Emoji) => e.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) || null;

		case DataType.message:
			const m = await message?.channel.messages.fetch(text);
			if (m) return m;

			const url = text.replace('https://discord.com/channels/', '').split('/');
			const channels: Collection<Snowflake, Channel> | undefined = client?.channels.cache;
			if (text.startsWith('https') && channels?.has(url[1])) {
				return (await (channels?.filter(c => c.isText()).get(url[1]) as TextChannel)?.messages.fetch(url[2])) || null;
			}

			if (channels) {
				for (const channel of channels) {
					const m = await (channel[1] as TextChannel).messages.fetch(text);
					if (m) return m;
				}
			}

			return null;
	}

	return null;
}
