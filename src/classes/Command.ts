import {Message, PermissionString, Snowflake} from 'discord.js';

interface CommandOptions {
	readonly name: string;
	description?: string;
	usage?: string;
	category?: string;
	aliases?: string[];
	clientPermissions?: PermissionString[];
	userPermissions?: PermissionString[];
	channels?: Snowflake[];
	guildOnly?: boolean;
	ownerOnly?: boolean;
	nsfw?: boolean;
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

export default class Command implements CommandOptions {
	public readonly name: string;
	public description: string;
	public usage: string;
	public category: string;
	public aliases: string[];
	public clientPermissions: PermissionString[];
	public userPermissions: PermissionString[];
	public channels: Snowflake[];
	public guildOnly: boolean;
	public ownerOnly: boolean;
	public nsfw: boolean;
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
		this.guildOnly = options.guildOnly ?? false;
		this.ownerOnly = options.ownerOnly ?? false;
		this.nsfw = options.nsfw ?? false;
		this.cooldown = options.cooldown ?? 0;
	}

	public deleteMessage({message, options}: DeleteMessageOptions): Promise<Message> | undefined {
		if (message.deletable) return message.delete(options);
	}
}
