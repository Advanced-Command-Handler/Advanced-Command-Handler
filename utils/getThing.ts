import {Emoji, Guild, GuildChannel, GuildMember, Message, NewsChannel, Role, TextChannel, User} from 'discord.js';
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
			return CommandHandler.commands.find((c: Command) => c.name === text || c.aliases && c.aliases.includes(text)) || null;
		
		case DataType.channel:
			return message?.guild?.channels.cache.get(text) ||
				message?.mentions.channels.first() ||
				message?.guild?.channels.cache.find((c: GuildChannel) => c.name.toLowerCase().includes((text as string).toLowerCase()) && text.toString().length > 1) ||
				null;
		case DataType.guild:
			return CommandHandler.client.guilds.get(text) || CommandHandler.client.guilds.find((g: Guild) => g.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) || null;
		
		case DataType.member:
			return message?.guild?.members.cache.get(text) ||
				message?.mentions?.members?.first() ||
				message?.guild?.members.cache.find((m: GuildMember) => (m.displayName.toLowerCase().includes((text as string).toLowerCase()) || m.user.username.toLowerCase().includes((text as string).toLowerCase())) && (text as string).length > 1) ||
				null;
		case DataType.user:
			return CommandHandler.client.users.get(text) || CommandHandler.client.users.find((u: User) => u.username.toLowerCase() === (text as string).toLowerCase()) || message?.mentions?.users.first() || null;
		
		case DataType.role:
			return message?.guild?.roles.cache.get(text) ||
				message?.mentions.roles.first() ||
				message?.guild?.roles.cache.find((r: Role) => r.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) ||
				null;
		case DataType.emote:
			return CommandHandler.client.emojis.get(text) || CommandHandler.client.emojis.find((e: Emoji) => e.name.toLowerCase().includes((text as string).toLowerCase()) && (text as string).length > 1) || null;
		
		case DataType.message:
			const m = await message?.channel.messages.fetch(text);
			if (m) return m;
			
			const url = text.replace('https://discord.com/channels/', '').split('/');
			if (text.startsWith('https') && CommandHandler.client.channels.has(url[1])) {
				return await CommandHandler.client.channels.get(url[1]).messages.fetch(url[2]) || null;
			}
			
			for (const channel of CommandHandler.client.channels) {
				const m = await channel[1].messages.fetch(text);
				if (m) return m;
			}
			
			return null;
	}
}

export default getThing;
