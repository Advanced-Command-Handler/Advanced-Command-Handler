import type {Message, PermissionString, Snowflake, TextChannel} from 'discord.js';

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

type RunFunction = (...options: any[]) => Promise<void> | void;

interface DeleteMessageOptions {
	message: Message;
	options?: {
		timeout?: number;
		reason?: string;
	};
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
}
