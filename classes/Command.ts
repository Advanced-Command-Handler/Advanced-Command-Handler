import {Message, PermissionString} from 'discord.js';
import CommandHandler from './CommandHandler';

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

module.exports = class Command implements CommandOptions {
	readonly name: string;
	description: string = '';
	usage: string = '';
	category: string = '';
	aliases: string[] = [];
	clientPermissions: PermissionString[] = [];
	userPermissions: PermissionString[] = [];
	guildOnly: boolean = false;
	ownerOnly: boolean = false;
	nsfw: boolean = false;
	cooldown: number = 0;
	run: RunFunction;
	
	constructor(options: CommandOptions, runFunction: RunFunction) {
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
	
	async deleteMessage(message: Message, options?: {
		timeout?: number;
		reason?: string
	}): Promise<Message | undefined> {
		if (message.deletable) return await message.delete(options);
	}
};
