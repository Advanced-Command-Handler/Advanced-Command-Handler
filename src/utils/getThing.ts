import {Emoji, Guild, GuildChannel, GuildMember, Message, NewsChannel, Role, TextChannel, User} from 'discord.js';
import {Command} from '../classes';
import {CommandHandler} from '../CommandHandler';

export enum DataType {
	CHANNEL = 'channel',
	COMMAND = 'command',
	EMOTE = 'emote',
	GUILD = 'guild',
	MEMBER = 'member',
	MESSAGE = 'message',
	ROLE = 'role',
	USER = 'user',
}

type DataTypeResolver<T extends DataType> = T | Lowercase<T>;

/**
 * Finds a GuildChannel {@link https://discord.js/#/docs/main/stable/class/Channel} from the text, or the message content and returns null if nothing found.
 * It can find it from ID/name/mention.
 *
 * @param dataType - GuildChannel {@link DataType.CHANNEL}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Channel or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.CHANNEL>, text: string | Message): Promise<GuildChannel | null>;
/**
 * Finds a Command {@link Command} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/alias.
 *
 * @param dataType - Command {@link DataType.COMMAND}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Command or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.COMMAND>, text: string | Message): Promise<Command | null>;
/**
 * Finds an Emoji {@link https://discord.js.org/#/docs/main/stable/class/Emoji} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/emoji itself/ID.
 *
 * @param dataType - Emote {@link DataType.EMOTE}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Emoji or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.EMOTE>, text: string | Message): Promise<Emoji | null>;
/**
 * Finds a Guild {@link https://discord.js.org/#/docs/main/stable/class/Guild} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/ID.
 *
 * @param dataType - Guild {@link DataType.GUILD}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Guild or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.GUILD>, text: string | Message): Promise<Guild | null>;
/**
 * Finds a GuildMember {@link https://discord.js.org/#/docs/main/stable/class/GuildMember} from the text, or the message content and returns null if nothing found.
 * It can find it from the username/ID/mention/nickname.
 *
 * @param dataType - Member {@link DataType.MEMBER}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Guild or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.MEMBER>, text: string | Message): Promise<GuildMember | null>;
/**
 * Finds a Message {@link https://discord.js.org/#/docs/main/stable/class/Message} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/ID/link.
 *
 * @param dataType - Message {@link DataType.MESSAGE}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Message or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.MESSAGE>, text: string | Message): Promise<Message | null>;
/**
 * Finds a Role {@link https://discord.js.org/#/docs/main/stable/class/Role} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/ID/mention.
 *
 * @param dataType - Role {@link DataType.ROLE}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Role or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.ROLE>, text: string | Message): Promise<Role | null>;
/**
 * Finds a User {@link https://discord.js.org/#/docs/main/stable/class/User} from the text, or the message content and returns null if nothing found.<br>
 * It can find it from the username/ID.
 *
 * @param dataType - User {@link DataType.USER}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The User or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.USER>, text: string | Message): Promise<User | null>;
/**
 * Finds the data from a string or a Message and returns null if nothing found.
 *
 * @param dataType - The data type {@link DataType}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Data found or null if not found.
 */
export async function getThing(
	dataType: DataTypeResolver<any>,
	text: string | Message
): Promise<Command | GuildChannel | TextChannel | NewsChannel | Guild | GuildMember | User | Role | Emoji | Message | null> {
	let message: Message | null;
	if (text instanceof Message) {
		message = text;
		text = text.content;
	} else message = null;

	const client = CommandHandler.client;
	switch (dataType) {
		case DataType.COMMAND:
			return CommandHandler.commands.find(c => c.name === text || (c.aliases?.includes(text as string) ?? false)) ?? null;

		case DataType.CHANNEL:
			return (
				message?.guild?.channels.cache.get(text) ||
				message?.mentions.channels.first() ||
				message?.guild?.channels.cache.find(c => c.name.toLowerCase().includes((text as string).toLowerCase()) && text.toString().length > 1) ||
				null
			);
		case DataType.GUILD:
			return (
				client?.guilds.cache.get(text) ||
				client?.guilds.cache.find(g => g.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ||
				null
			);

		case DataType.MEMBER:
			return (
				message?.guild?.members.cache.get(text) ||
				message?.mentions?.members?.first() ||
				message?.guild?.members.cache.find(
					m =>
						(m.displayName.toLowerCase().includes((text as string).toLowerCase()) ||
							m.user.username.toLowerCase().includes((text as string).toLowerCase())) &&
						(text as string).length > 1
				) ||
				null
			);
		case DataType.USER:
			return (
				client?.users.cache.get(text) ||
				client?.users.cache.find(u => u.username.toLowerCase() === (text as string).toLowerCase()) ||
				message?.mentions?.users.first() ||
				null
			);

		case DataType.ROLE:
			return (
				message?.guild?.roles.cache.get(text) ||
				message?.mentions.roles.first() ||
				message?.guild?.roles.cache.find(r => r.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ||
				null
			);
		case DataType.EMOTE:
			return (
				client?.emojis.cache.get(text) ||
				client?.emojis.cache.find(e => e.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ||
				null
			);

		case DataType.MESSAGE:
			const m = await message?.channel.messages.fetch(text);
			if (m) return m;

			const url = text.replace('https://discord.com/channels/', '').split('/');
			const channels = client?.channels.cache;
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

		default:
			return null;
	}
}
