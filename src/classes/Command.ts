import {DMChannel, GuildChannel, Message, PermissionString, Snowflake, TextChannel} from 'discord.js';
import {RunFunction} from '../types.js';
import CommandHandler from './CommandHandler';

export enum Tag {
	guildOnly,
	ownerOnly,
	nsfw,
	guildOwnerOnly,
	dmOnly,
}

interface CommandOptions {
	readonly name: string;
	description?: string;
	usage?: string;
	category?: string;
	aliases?: string[];
	clientPermissions?: PermissionString[];
	userPermissions?: PermissionString[];
	channels?: Array<Snowflake | TextChannel>;
	tags?: Tag[];
	cooldown?: number;
}

interface DeleteMessageOptions {
	message: Message;
	options?: {
		timeout?: number;
		reason?: string;
	};
}

interface MissingPermissions {
	client: PermissionString[];
	user: PermissionString[];
}

export class Command implements CommandOptions {
	public readonly name: string;
	public description: string;
	public usage: string;
	public category: string;
	public aliases: string[];
	public clientPermissions: PermissionString[];
	public userPermissions: PermissionString[];
	public channels: Array<Snowflake | TextChannel>;
	public tags: Tag[];
	public cooldown: number;
	public run: RunFunction;

	public constructor(options: CommandOptions, runFunction: RunFunction) {
		this.name = options.name;
		this.run = runFunction;
		this.description = options.description ?? '';
		this.usage = options.usage ?? '';
		this.category = options.category ?? 'None';
		this.aliases = options.aliases ?? [];
		this.clientPermissions = options.clientPermissions ?? ['SEND_MESSAGES'];
		this.userPermissions = options.userPermissions ?? ['SEND_MESSAGES'];
		this.channels = options.channels ?? [];
		this.tags = options.tags ?? [];
		this.cooldown = options.cooldown ?? 0;
	}

	public deleteMessage({message, options}: DeleteMessageOptions): Promise<Message> | undefined {
		if (message.deletable) return message.delete(options);
	}

	public getMissingPermissions(message: Message): MissingPermissions {
		const missingPermissions: MissingPermissions = {
			client: [],
			user: [],
		};
		if (!message.guild || !message.guild?.available) return missingPermissions;

		missingPermissions.client.push(
			...this.userPermissions.filter(permission => {
				if (!(message.channel instanceof DMChannel)) return !message.channel.permissionsFor(message.guild?.me!!)?.has(permission, false);
			})
		);
		missingPermissions.user.push(
			...this.userPermissions.filter(permission => {
				if (!(message.channel instanceof DMChannel)) return !message.channel.permissionsFor(message.member!!)?.has(permission, false);
			})
		);

		if (message.guild.me?.hasPermission('ADMINISTRATOR')) missingPermissions.client = [];
		if (message.member?.hasPermission('ADMINISTRATOR')) missingPermissions.user = [];

		return missingPermissions;
	}

	public getMissingTags(message: Message): Tag[] {
		const missingTags: Tag[] = [];

		for (const tag of this.tags) {
			if (tag === Tag.ownerOnly && !CommandHandler.instance?.owners?.includes(message.author.id)) missingTags.push(Tag.ownerOnly);
			if (tag === Tag.nsfw && message.channel instanceof GuildChannel && !message.channel.nsfw) missingTags.push(Tag.nsfw);
			if (tag === Tag.guildOnly && message.guild === null) missingTags.push(Tag.guildOnly);
			if (tag === Tag.guildOwnerOnly && message.guild?.ownerID !== message.author.id) missingTags.push(Tag.guildOwnerOnly);
			if (tag === Tag.dmOnly && message.guild !== null) missingTags.push(Tag.dmOnly);
		}
		return missingTags;
	}

	public isInRightChannel(message: Message): boolean {
		if (this.channels.length === 0) return true;
		return this.channels.every(channel => {
			return message.channel instanceof TextChannel ? (channel instanceof TextChannel ? channel.id === message.channel?.id : channel === message.channel.id) : false;
		});
	}
}
