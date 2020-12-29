import {Channel, Collection, Emoji, Guild, GuildChannel, GuildMember, Message, NewsChannel, Role, Snowflake, TextChannel, User} from 'discord.js';
import {Command} from '../classes/Command';
import CommandHandler from '../classes/CommandHandler';

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

export async function getThing(dataType: DataType.channel | 'channel', text: string | Message): Promise<GuildChannel | null>;
export async function getThing(dataType: DataType.command | 'command', text: string | Message): Promise<Command | null>;
export async function getThing(dataType: DataType.emote | 'emote', text: string | Message): Promise<Emoji | null>;
export async function getThing(dataType: DataType.guild | 'guild', text: string | Message): Promise<Guild | null>;
export async function getThing(dataType: DataType.message | 'message', text: string | Message): Promise<Message | null>;
export async function getThing(dataType: DataType.role | 'role', text: string | Message): Promise<Role | null>;
export async function getThing(dataType: DataType.user | 'message', text: string | Message): Promise<User | null>;
export async function getThing(
	dataType: DataType | keyof typeof DataType,
	text: string | Message
): Promise<Command | GuildChannel | TextChannel | NewsChannel | Guild | GuildMember | User | Role | Emoji | Message | null | undefined> {
	let message: Message | null;
	if (text instanceof Message) {
		message = text;
		text = text.content;
	} else message = null;

	const client = CommandHandler.instance.client;
	switch (dataType) {
		case DataType.command:
			return CommandHandler.instance.commands.find((c: Command) => c.name === text || (c.aliases && c.aliases.includes(text as string))) || null;

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
}
