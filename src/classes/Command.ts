import {Message, PermissionString} from 'discord.js';
import CommandHandler from './CommandHandler.js';

interface CommandOptions {
	readonly name: string;
	description: string;
	usage: string;
	category: string;
	aliases: string[];
	clientPermissions: PermissionString[];
	userPermissions: PermissionString[];
	guildOnly: boolean;
	ownerOnly: boolean;
	nsfw: boolean;
	cooldown: number;
}

type RunFunction = (handler?: CommandHandler, message?: Message, args?: string[]) => Promise<void> | void;

interface DeleteMessageOptions {
	message: Message;
	options?: {
		timeout?: number;
		reason?: string;
	};
}

export default class Command implements CommandOptions {
	public readonly name: string;
	public description: string = '';
	public usage: string = '';
	public category: string = '';
	public aliases: string[] = [];
	public clientPermissions: PermissionString[] = [];
	public userPermissions: PermissionString[] = [];
	public guildOnly: boolean = false;
	public ownerOnly: boolean = false;
	public nsfw: boolean = false;
	public cooldown: number = 0;
	public run: RunFunction;
	
	public constructor(options: CommandOptions, runFunction: RunFunction) {
		this.name = options.name;
		this.run = runFunction;
		this.description = options.description ? options.description : '';
		this.usage = options.usage ? options.usage : '';
		this.category = options.category ? options.category : 'None';
		this.aliases = options.aliases ? options.aliases : [];
		this.clientPermissions = options.clientPermissions ? options.clientPermissions : ['SEND_MESSAGES'];
		this.userPermissions = options.userPermissions ? options.userPermissions : ['SEND_MESSAGES'];
		this.guildOnly = options.guildOnly ? options.guildOnly : false;
		this.ownerOnly = options.ownerOnly ? options.ownerOnly : false;
		this.nsfw = options.nsfw ? options.nsfw : false;
		this.cooldown = options.cooldown ? options.cooldown : 0;
	}
	
	public async deleteMessage(
		{
			message,
			options
		}: DeleteMessageOptions
	): Promise<Message | undefined> {
		if (message.deletable) return await message.delete(options);
	}
}
