import {DMChannel, GuildChannel, Message, Permissions, PermissionString, Snowflake, TextChannel} from 'discord.js';
import {DefaultCommandRunFunction, RunFunction} from '../types';
import CommandHandler from '../CommandHandler.js';
import {isOwner} from '../utils/utils.js';

export enum Tag {
	guildOnly,
	ownerOnly,
	nsfw,
	guildOwnerOnly,
	dmOnly,
}

interface CommandOptions {
	readonly name: string;
	aliases?: string[];
	category?: string;
	channels?: Array<Snowflake | TextChannel>;
	clientPermissions?: PermissionString[];
	cooldown?: number;
	description?: string;
	tags?: Tag[];
	usage?: string;
	userPermissions?: PermissionString[];
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
	public aliases: string[];
	public category: string;
	public channels: Array<Snowflake | TextChannel>;
	public clientPermissions: PermissionString[];
	public cooldown: number;
	public description: string;
	public tags: Tag[];
	public usage: string;
	public userPermissions: PermissionString[];
	public run: RunFunction | DefaultCommandRunFunction;

	public constructor(options: CommandOptions, runFunction: RunFunction | DefaultCommandRunFunction) {
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
		if (!message.guild || !message.guild.available) return missingPermissions;

		missingPermissions.client.push(
			...this.clientPermissions.filter(permission => {
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

	public getInvalidPermissions() {
		const permissionsFlags: string[] = [...Object.keys(Permissions.FLAGS)];

		return {
			user: this.userPermissions.filter(permission => !permissionsFlags.includes(permission)),
			client: this.clientPermissions.filter(permission => !permissionsFlags.includes(permission)),
		};
	}

	public getMissingTags(message: Message): Tag[] {
		const missingTags: Tag[] = [];
		for (const tag of this.tags) {
			if (tag === Tag.ownerOnly && !isOwner(message.author.id)) missingTags.push(Tag.ownerOnly);
			if (tag === Tag.nsfw && message.channel instanceof GuildChannel && !message.channel.nsfw) missingTags.push(Tag.nsfw);
			if (tag === Tag.guildOnly && message.guild === null) missingTags.push(Tag.guildOnly);
			if (tag === Tag.guildOwnerOnly && message.guild?.ownerID !== message.author.id) missingTags.push(Tag.guildOwnerOnly);
			if (tag === Tag.dmOnly && message.channel.type !== 'dm') missingTags.push(Tag.dmOnly);
		}

		return missingTags;
	}

	public isInRightChannel(message: Message): boolean {
		if (this.channels.length === 0) return true;
		return this.channels.every(channel => {
			return message.channel instanceof TextChannel ? (channel instanceof TextChannel ? channel.id === message.channel.id : channel === message.channel.id) : false;
		});
	}

	public isInCooldown(message: Message): boolean {
		return CommandHandler.cooldowns.has(message.author.id) && Object.keys(CommandHandler.cooldowns.get(message.author.id)!).includes(this.name);
	}

	public getCooldown(message: Message): {waitMore: number; executedAt: Date; cooldown: number} {
		const cooldown = CommandHandler.cooldowns.get(message.author.id)![this.name];
		return {
			...cooldown,
			waitMore: cooldown.executedAt.getTime() + cooldown.cooldown * 1000 - Date.now(),
		};
	}

	public setCooldown(message: Message) {
		if (!CommandHandler.cooldowns.has(message.author.id)) CommandHandler.cooldowns.set(message.author.id, {});
		if (this.cooldown === 0 ?? !!CommandHandler.cooldowns.get(message.author.id)![this.name]) return;

		CommandHandler.cooldowns.get(message.author.id)![this.name] = {
			executedAt: message.createdAt,
			cooldown: this.cooldown,
		};

		setTimeout(() => {
			delete CommandHandler.cooldowns.get(message.author.id)![this.name];
		}, this.cooldown * 1000);
	}
}
