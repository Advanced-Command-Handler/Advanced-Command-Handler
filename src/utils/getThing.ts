import {Channel, DMChannel, Emoji, Guild, GuildChannel, GuildMember, Message, Role, TextChannel, User, Util} from 'discord.js';
import {Command, CommandHandler, isTextChannelLike, TextChannelLike} from '../';

export enum DataType {
	CHANNEL = 'channel',
	COMMAND = 'command',
	EMOTE = 'emote',
	GUILD = 'guild',
	MEMBER = 'member',
	MESSAGE = 'message',
	ROLE = 'role',
	TEXT_CHANNEL = 'text_channel',
	USER = 'user',
}

type ReturnTypes = {[k in Lowercase<DataType>]: any} & {
	channel: Channel;
	command: Command;
	emote: Emoji;
	guild: Guild;
	member: GuildMember;
	message: Message;
	role: Role;
	textChannel: TextChannelLike;
	user: User;
};

type DataTypeResolver<T extends DataType> = T | Lowercase<T>;

/**
 * Finds a {@link https://discord.js/#/docs/main/stable/class/Channel | Channel} from the text, or the message content and returns null if nothing found.
 * It can find it from ID/name/mention.
 *
 * @param dataType - Channel {@link DataType.CHANNEL}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Channel or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.CHANNEL>, text: string | Message): Promise<Channel | null>;
/**
 * Finds a {@link Command} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/alias.
 *
 * @param dataType - Command {@link DataType.COMMAND}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Command or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.COMMAND>, text: string | Message): Promise<Command | null>;
/**
 * Finds an {@link https://discord.js.org/#/docs/main/stable/class/Emoji | Emoji} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/emoji itself/ID.
 *
 * @param dataType - Emote {@link DataType.EMOTE}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Emoji or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.EMOTE>, text: string | Message): Promise<Emoji | null>;
/**
 * Finds a {@link https://discord.js.org/#/docs/main/stable/class/Guild | Guild} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/ID.
 *
 * @param dataType - Guild {@link DataType.GUILD}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Guild or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.GUILD>, text: string | Message): Promise<Guild | null>;
/**
 * Finds a {@link https://discord.js.org/#/docs/main/stable/class/GuildMember | GuildMember} from the text, or the message content and returns null if nothing found.
 * It can find it from the username/ID/mention/nickname.
 *
 * @param dataType - Member {@link DataType.MEMBER}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Guild or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.MEMBER>, text: string | Message): Promise<GuildMember | null>;
/**
 * Finds a {@link https://discord.js.org/#/docs/main/stable/class/Message | Message} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/ID/link.
 *
 * @param dataType - Message {@link DataType.MESSAGE}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Message or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.MESSAGE>, text: string | Message): Promise<Message | null>;
/**
 * Finds a {@link https://discord.js.org/#/docs/main/stable/class/Role | Role} from the text, or the message content and returns null if nothing found.
 * It can find it from the name/ID/mention, if a message is provided, it will fetch the last 100 messages and search in it.
 *
 * @param dataType - Role {@link DataType.ROLE}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Role or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.ROLE>, text: string | Message): Promise<Role | null>;

/**
 * Finds a {@link https://discord.js/#/docs/main/stable/class/TextChannel | TextChannel} or a {@link https://discord.js/#/docs/main/stable/class/NewsChannel | NewsChannel} from the text, or the message content and returns null if nothing found.
 * It can find it from ID/name/mention.
 *
 * @param dataType - TextChannel | NewsChannel {@link DataType.TEXT_CHANNEL}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Channel or null if not found.
 */
export async function getThing(dataType: DataTypeResolver<DataType.TEXT_CHANNEL>, text: string | Message): Promise<TextChannelLike | null>;
/**
 * Finds a {@link https://discord.js.org/#/docs/main/stable/class/User | User} from the text, or the message content and returns null if nothing found.<br>
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
 * @typeParam T - The DataType you want.
 * @param dataType - The data type {@link DataType}.
 * @param text - A string or a Message to find dataType from.
 * @returns - The Data found or null if not found.
 */
export async function getThing<T extends DataType>(dataType: DataTypeResolver<T>, text: string | Message): Promise<ReturnTypes[Lowercase<T>] | null> {
	let message: Message | null;
	if (text instanceof Message) {
		message = text;
		text = text.content;
	} else message = null;

	const client = CommandHandler.client;
	switch (dataType) {
		case DataType.COMMAND:
			return CommandHandler.findCommand(text as string) ?? null;

		case DataType.CHANNEL:
			return (
				client?.channels.cache.get(text) ??
				message?.mentions.channels.first() ??
				client?.channels.cache.find(
					c =>
						(c instanceof GuildChannel && c.name.toLowerCase().includes((text as string).toLowerCase()) && text.toString().length > 1) ||
						(c instanceof DMChannel && c.recipient.username.toLowerCase().includes((text as string).toLowerCase()) && text.toString().length > 2) ||
						false
				) ??
				client?.channels.resolve(text) ??
				null
			);
		case DataType.EMOTE:
			return (
				client?.emojis.cache.get(text) ??
				client?.emojis.cache.find(e => (e.name?.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ?? false) ??
				Util.resolvePartialEmoji(text) ??
				null
			);

		case DataType.GUILD:
			return (
				client?.guilds.cache.get(text) ??
				client?.guilds.cache.find(g => g.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ??
				client?.guilds.resolve(text) ??
				message?.mentions.guild ??
				null
			);
		case DataType.MEMBER:
			return (
				message?.guild?.members.cache.get(text) ??
				message?.mentions?.members?.first() ??
				message?.guild?.members.cache.find(
					m =>
						(m.displayName.toLowerCase().includes((text as string).toLowerCase()) ||
							m.user.username.toLowerCase().includes((text as string).toLowerCase())) &&
						(text as string).length > 1
				) ??
				message?.guild?.members.resolve(text) ??
				null
			);
		case DataType.MESSAGE:
			const m = await message?.channel.messages.fetch(text);
			if (m) return m;

			const url = text.replace(/https:\/\/((canary|ptb).)?discord.com\/channels\//, '').split('/');
			const channels = client?.channels.cache;
			if (text.startsWith('https') && channels?.has(url[1])) {
				return (await (channels?.filter(c => c.isText()).get(url[1]) as TextChannel)?.messages.fetch(url[2])) || null;
			}

			if (channels) {
				for (const [_, channel] of channels) {
					const m = await (channel as TextChannel).messages.fetch(text);
					if (m) return m;
				}
			}

			return null;

		case DataType.TEXT_CHANNEL:
			const result =
				client?.channels.cache.filter(c => isTextChannelLike(c)).get(text) ??
				message?.mentions.channels.filter(c => isTextChannelLike(c)).first() ??
				client?.channels.cache.find(
					c => (isTextChannelLike(c) && c.name.toLowerCase().includes((text as string).toLowerCase()) && text.toString().length > 1) || false
				) ??
				client?.channels.resolve(text) ??
				null;

			return isTextChannelLike(result) ? result : null;
		case DataType.ROLE:
			return (
				message?.guild?.roles.cache.get(text) ??
				message?.mentions.roles.first() ??
				message?.guild?.roles.cache.find(r => r.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ??
				message?.guild?.roles.resolve(text) ??
				null
			);

		case DataType.USER:
			return (
				client?.users.cache.get(text) ??
				client?.users.cache.find(u => u.username.toLowerCase() === (text as string).toLowerCase()) ??
				message?.mentions?.users.first() ??
				client?.users.resolve(text) ??
				null
			);
		default:
			return null;
	}
}
