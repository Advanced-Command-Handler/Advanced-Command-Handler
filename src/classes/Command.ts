import {DMChannel, GuildChannel, GuildMember, Message, PermissionOverwrites, Permissions, PermissionString, Snowflake, TextChannel, User} from 'discord.js';
import {CommandHandler} from '../CommandHandler';
import {isPermission} from '../utils/permissionsError.js';
import {isOwner} from '../utils/utils';
import {CommandContext} from './CommandContext.js';
import CommandCooldown = CommandHandler.CommandCooldown;

/**
 * # How tags should works ?
 *
 * When using commands, you want certain commands to only run on a server or in DM etc.<br>
 * Most of other CommandHandlers uses boolean properties like `guildOnly`.<br>
 * To avoid having a ton of these, I imagined a system where you have command tags and for every calls, tags for the command are verified one by one.<br>
 * And this system works very smoothly !<br>
 * So if you're using the default message event
 * ({@link https://github.com/Ayfri/Advanced-Command-Handler/wiki/Defaults#defaults-events | see how to use defaults events }), tags will be checked.
 *
 * @example
 * ```ts
 * if (command.tags.includes(Tag.guildOnly) && !message.guild) {
 *     message.channel.send(`You must be on a guild to execute the ${command.name} command !`);
 * }
 * ```
 */
export enum Tag {
	/**
	 * Tag for commands to only run on a guild.
	 */
	guildOnly = 'guildOnly',
	/**
	 * Tag for commands to only run if author is an owner defined in {@link CommandHandler.owners}.
	 */
	ownerOnly = 'ownerOnly',
	/**
	 * Tag for commands to only run on a guild and in an NSFW channel.
	 */
	nsfw = 'nsfw',
	/**
	 * Tag for commands to only run on a guild and if the author is the owner of the guild.
	 */
	guildOwnerOnly = 'guildOwnerOnly',
	/**
	 * Tag for commands to only run in DM.
	 */
	dmOnly = 'dmOnly',
}

export interface Cooldown extends CommandCooldown {
	/**
	 * The time to wait, in seconds & milliseconds.
	 */
	waitMore: number;
}

/**
 * Options for the Command#deleteMessage method.
 */
export interface DeleteMessageOptions {
	/**
	 * The message to delete.
	 */
	message: Message;
	/**
	 * The options from {@link https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=delete | Message#delete}.
	 */
	options?: {
		/**
		 * How long to wait to delete the message in milliseconds.
		 */
		timeout?: number;
		/**
		 * Reason for deleting this message, if it does not belong to the client user.
		 */
		reason?: string;
	};
}

export interface MissingPermissions {
	client: PermissionString[];
	user: PermissionString[];
}

export abstract class Command {
	/**
	 * The name of the command.
	 */
	public abstract readonly name: string = '';
	/**
	 * The aliases of the command.
	 */
	public aliases?: string[];
	/**
	 * The category of the command.
	 *
	 * @defaultValue The command parent directory.
	 */
	public category?: string;
	/**
	 * The channels where the command should only be executed if used (if using the default message event).
	 */
	public channels?: Array<Snowflake | TextChannel>;
	/**
	 * The client permissions needed to run the command (if using the default message event).
	 *
	 * @defaultValue `['SEND_MESSAGES']`
	 */
	public clientPermissions?: Array<PermissionString | string>;
	/**
	 * The cooldown of the command.
	 *
	 * @defaultValue 0
	 * @remarks
	 * Every cooldown should be saved in {@link CommandHandler.cooldowns}.
	 */
	public cooldown?: number;
	/**
	 * The description of the command.
	 */
	public description?: string;
	/**
	 * The tags of the command.
	 *
	 * @remarks
	 * How tags works ?
	 * @see {@link Tag}
	 */
	public tags?: Array<Tag | keyof typeof Tag | string>;
	/**
	 * The usage of the command.
	 *
	 * @example
	 * ```
	 * userinfo
	 * userinfo me
	 * userinfo <ID/Username/Mention of User>
	 * ```
	 */
	public usage?: string;
	/**
	 * The user permissions needed to run the command (if using the default message event).
	 *
	 * @defaultValue `['SEND_MESSAGES']`
	 */
	public userPermissions?: Array<PermissionString | string>;

	/**
	 * Get an user ID from different sources, only here to simplify code.
	 *
	 * @param from - Where to get ID from.
	 * @returns The ID.
	 * @internal
	 */
	private static getSnowflake(from: Message | User | Snowflake | GuildMember): Snowflake {
		return from instanceof Message ? from.author.id : from instanceof User ? from.id : from instanceof GuildMember ? from.user.id : from;
	}

	/**
	 * The function to run when executing the command.
	 *
	 * @param ctx
	 */
	public abstract run(ctx: CommandContext): Promise<any>;

	/**
	 * Deletes a message if deletable.
	 *
	 * @param options - The options, see {@link DeleteMessageOptions}.
	 * @returns The deleted message if deleted.
	 */
	public deleteMessage(options: DeleteMessageOptions): Promise<Message> | undefined {
		if (options.message.deletable) return options.message.delete(options.options);
	}

	/**
	 * Returns the missing permissions from the client & user for a message.
	 *
	 * @param message - The message to check permissions for.
	 * @returns The missing permissions.
	 */
	public getMissingPermissions(message: Message): MissingPermissions {
		const missingPermissions: MissingPermissions = {
			client: [],
			user: [],
		};
		if (!message.guild || !message.guild.available) return missingPermissions;

		if (this.clientPermissions) {
			missingPermissions.client.push(
				//@ts-ignore
				...this.clientPermissions.filter(permission => {
					if (isPermission(permission) && !(message.channel instanceof DMChannel)) {
						return !message.channel.permissionsFor(message.guild?.me!!)?.has(permission as PermissionString, false);
					}
				})
			);
		}

		if (this.userPermissions) {
			missingPermissions.user.push(
				// @ts-ignore
				...this.userPermissions.filter(permission => {
					if (isPermission(permission) && !(message.channel instanceof DMChannel)) {
						return !message.channel.permissionsFor(message.member!!)?.has(permission, false);
					}
				})
			);
		}

		if (message.guild.me?.hasPermission('ADMINISTRATOR')) missingPermissions.client = [];
		if (message.member?.hasPermission('ADMINISTRATOR')) missingPermissions.user = [];

		return missingPermissions;
	}

	/**
	 * Returns the invalid permissions (not presents in {@link https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS | Permissions.FLAGS}).
	 *
	 * @returns The invalid permissions put in {@link clientPermissions} & {@link userPermissions}.
	 * @internal
	 */
	public getInvalidPermissions() {
		const permissionsFlags: string[] = [...Object.keys(Permissions.FLAGS)];

		return {
			user: this.userPermissions?.filter(permission => !permissionsFlags.includes(permission)) ?? [],
			client: this.clientPermissions?.filter(permission => !permissionsFlags.includes(permission)) ?? [],
		};
	}

	/**
	 * Gives the {@link tags} of this command which are not validated by the message.<br>
	 * i.e. If a command is executed on a guild and the command has the `dmOnly` Tag, it will be returned.
	 *
	 * @param message - The message to test tags from.
	 * @returns Tags that are not validated by the message.
	 */
	public getMissingTags(message: Message): Tag[] {
		const missingTags: Tag[] = [];
		for (const tag of this.tags ?? []) {
			if (tag === Tag.ownerOnly && !isOwner(message.author.id)) missingTags.push(Tag.ownerOnly);
			if (tag === Tag.nsfw && message.channel instanceof GuildChannel && !message.channel.nsfw) missingTags.push(Tag.nsfw);
			if (tag === Tag.guildOnly && message.guild === null) missingTags.push(Tag.guildOnly);
			if (tag === Tag.guildOwnerOnly && message.guild?.ownerID !== message.author.id) missingTags.push(Tag.guildOwnerOnly);
			if (tag === Tag.dmOnly && message.channel.type !== 'dm') missingTags.push(Tag.dmOnly);
		}

		return missingTags;
	}

	/**
	 * Returns false if {@link channels} are defined for this command but the message doesn't come from one of it.
	 *
	 * @param from - The message or channel to test where it comes from.
	 * @returns If it is on a channel required if used.
	 */
	public isInRightChannel(from: Message | TextChannel): boolean {
		const channel = from instanceof Message ? (from.channel as TextChannel) : from;
		if (this.channels?.length === 0) return true;
		return this.channels?.every(ch => (ch instanceof TextChannel ? channel.id === ch.id : false)) ?? true;
	}

	/**
	 * Returns true if the user is in a cooldown for this command.
	 *
	 * @remarks
	 * If {@link cooldown} not set, this will always return `false`.
	 * @param from - From where to test if user is in a cooldown, see types.
	 * @returns Is user in a cooldown.
	 */
	public isInCooldown(from: Message | User | Snowflake | GuildMember): boolean {
		const id = Command.getSnowflake(from);
		return CommandHandler.cooldowns.has(id) && Object.keys(CommandHandler.cooldowns.get(id)!).includes(this.name);
	}

	/**
	 * Get the actual cooldown of the user for this command plus when command has been executed and how many seconds to wait.
	 *
	 * @param from - Where to get the cooldown from, see types.
	 * @returns The user's cooldown.
	 */
	public getCooldown(from: Message | User | Snowflake | GuildMember): Cooldown {
		const cooldown = CommandHandler.cooldowns.get(Command.getSnowflake(from))![this.name];
		return {
			...cooldown,
			waitMore: cooldown.executedAt.getTime() + cooldown.cooldown * 1000 - Date.now(),
		};
	}

	/**
	 * Put all the required properties in {@link CommandHandler.cooldowns} plus the `setTimeout` to remove the user from the cooldowns.
	 *
	 * @param from - What to use to select the user to set the cooldown from.
	 */
	public setCooldown(from: Message | User | Snowflake | GuildMember): void {
		const cooldown: number = this.cooldown ?? 0;
		const id = Command.getSnowflake(from);
		if (!CommandHandler.cooldowns.has(id)) CommandHandler.cooldowns.set(id, {});
		if (this.cooldown === 0 ?? !!CommandHandler.cooldowns.get(id)![this.name]) return;

		CommandHandler.cooldowns.get(id)![this.name] = {
			executedAt: from instanceof Message ? from.createdAt : new Date(),
			cooldown,
		};

		setTimeout(() => delete CommandHandler.cooldowns.get(id)![this.name], cooldown * 1000);
	}
}
