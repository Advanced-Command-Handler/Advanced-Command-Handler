import {Channel, Collection, Emoji, Guild, GuildChannel, GuildMember, Message, NewsChannel, Role, Snowflake, TextChannel, User} from 'discord.js';
import Command from '../classes/Command.js';
import CommandHandler from '../classes/CommandHandler.js';

export enum DataType {
	command,
	channel,
	guild,
	member,
	user,
	role,
	emote,
	message,
}

async function getThing(dataType: DataType.channel, text: string | Message): Promise<GuildChannel | null>;
async function getThing(dataType: DataType.command, text: string | Message): Promise<Command | null>;
async function getThing(dataType: DataType.emote, text: string | Message): Promise<Emoji | null>;
async function getThing(dataType: DataType.guild, text: string | Message): Promise<Guild | null>;
async function getThing(dataType: DataType.message, text: string | Message): Promise<Message | null>;
async function getThing(dataType: DataType.role, text: string | Message): Promise<Role | null>;
async function getThing(dataType: DataType.user, text: string | Message): Promise<User | null>;
async function getThing(dataType: DataType, text: string | Message): Promise<Command | GuildChannel | TextChannel | NewsChannel | Guild | GuildMember | User | Role | Emoji | Message | null> {
	let message: Message | null;
	if (text instanceof Message) {
		message = text;
		text = text.toString();
	} else message = null;

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
			return (
				CommandHandler.client?.guilds.cache.get(text) ||
				CommandHandler.client?.guilds.cache.find((g: Guild) => g.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ||
				null
			);

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
			return (
				CommandHandler.client?.users.cache.get(text) ||
				CommandHandler.client?.users.cache.find((u: User) => u.username.toLowerCase() === (text as string).toLowerCase()) ||
				message?.mentions?.users.first() ||
				null
			);

		case DataType.role:
			return (
				message?.guild?.roles.cache.get(text) ||
				message?.mentions.roles.first() ||
				message?.guild?.roles.cache.find((r: Role) => r.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ||
				null
			);
		case DataType.emote:
			return (
				CommandHandler.client?.emojis.cache.get(text) ||
				CommandHandler.client?.emojis.cache.find((e: Emoji) => e.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ||
				null
			);

		case DataType.message:
			const m = await message?.channel.messages.fetch(text);
			if (m) return m;

			const url = text.replace('https://discord.com/channels/', '').split('/');
			const channels: Collection<Snowflake, Channel> | undefined = CommandHandler.client?.channels.cache;
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

export default getThing;
