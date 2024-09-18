import {GuildChannel, GuildMember, Message, Permissions, type PermissionString, type Snowflake, type TextChannel, User} from 'discord.js';
import {CommandHandler} from '../../CommandHandler.js';
import {Logger} from '../../helpers/Logger.js';
import {isPermission} from '../../helpers/permissionUtils.js';
import {isOwner} from '../../helpers/utils.js';
import {type Argument} from '../arguments/Argument.js';
import {CommandArgument} from '../arguments/CommandArgument.js';
import type {CommandContext} from '../contexts/CommandContext.js';
import {SubCommandContext} from '../contexts/SubCommandContext.js';
import {CommandError, type CommandErrorBuilder, CommandErrorType} from '../errors/CommandError.js';
import type {RunSubCommandFunction, SubCommandOptions} from './SubCommand.js';
import CommandCooldown = CommandHandler.CommandCooldown;

/**
 * # How tags should work ?
 *
 * When using commands, you want certain commands to only run on a server or in private messages etc.<br>
 * Most other CommandHandlers uses boolean properties like `guildOnly`.<br>
 * To avoid having a ton of these, I imagined a system where you have command tags and for every call, tags of the command are verified one by one.<br>
 * And this system works very smoothly !<br>
 * So if you're using the default message event
 * ({@link https://ayfri.gitbook.io/advanced-command-handler/defaults | see how to use defaults events }), tags will be checked.
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
	 * Tag for commands to not run in a thread.
	 */
	channelOnly = 'channelOnly',
	/**
	 * Tag for commands to only run in private messages.
	 */
	dmOnly = 'dmOnly',
	/**
	 * Tag for commands to only run on a guild.
	 */
	guildOnly = 'guildOnly',
	/**
	 * Tag for commands to only run on a guild and if the author is the owner of the guild.
	 */
	guildOwnerOnly = 'guildOwnerOnly',
	/**
	 * Tag for commands to only run if author is an owner defined in {@link CommandHandler.owners}.
	 */
	ownerOnly = 'ownerOnly',
	/**
	 * Tag for commands to only run on a guild and in an NSFW channel.
	 */
	nsfw = 'nsfw',
	/**
	 * Tag for commands to only run in a thread.
	 */
	threadOnly = 'threadOnly',
}

export namespace Tag {
	/**
	 * Check if some tags are validated in the command context.
	 *
	 * @param ctx - The command context.
	 * @param tags - The tags to test.
	 * @returns - The tags not validated.
	 */
	export function check(ctx: CommandContext, tags: Array<Tag | string>) {
		const missingTags: Tag[] = [];
		for (const tag of tags ?? []) {
			/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
			if (tag === Tag.channelOnly && ctx.channel.isThread()) missingTags.push(Tag.threadOnly);
			if (tag === Tag.dmOnly && ctx.channel.type !== 'DM') missingTags.push(Tag.dmOnly);
			if (tag === Tag.guildOnly && !ctx.guild) missingTags.push(Tag.guildOnly);
			if (tag === Tag.guildOwnerOnly && ctx.guild?.ownerId !== ctx.user.id) missingTags.push(Tag.guildOwnerOnly);
			if (tag === Tag.nsfw && ctx.channel instanceof GuildChannel && !ctx.channel.nsfw) missingTags.push(Tag.nsfw);
			if (tag === Tag.ownerOnly && !isOwner(ctx.user.id)) missingTags.push(Tag.ownerOnly);
			if (tag === Tag.threadOnly && !ctx.channel.isThread()) missingTags.push(Tag.threadOnly);
			/* eslint-enable @typescript-eslint/no-unsafe-enum-comparison */
		}

		return missingTags;
	}
}

/**
 * The cooldown object.
 */
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
	 * How long to wait to delete the message in milliseconds.
	 */
	timeout?: number;
}

/**
 * The object for missing permissions.
 */
export interface MissingPermissions {
	/**
	 * Missing permissions of the client.
	 */
	client: PermissionString[];
	/**
	 * Missing permissions of the user.
	 */
	user: PermissionString[];
}

/**
 * An interface to put optional methods for the {@link Command} class.
 */
export interface Command {
	/**
	 * Override this method to register your subCommands.
	 */
	registerSubCommands?(): any;
}

export interface CommandSignatureOptions {
	showDefaultValues?: boolean;
	showTypes?: boolean;
}

/**
 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/commands}
 */
export abstract class Command {
	/**
	 * The aliases of the command.
	 */
	public aliases?: string[];

	/**
	 * The arguments of the command.
	 * You can put your own custom arguments, but you must add the type to the {@link ArgumentType | argument types}.
	 */
	public arguments: Record<string, Argument<any>> = {};
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
	public clientPermissions?: Array<PermissionString>;
	/**
	 * The cooldown of the command in seconds.
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
	 * The name of the command.
	 */
	public abstract readonly name: string;
	/**
	 * The SubCommands of this command.
	 *
	 * @remarks Register SubCommands using the {@link Command#registerSubCommands} method.
	 */
	public subCommands: SubCommand[] = [];
	/**
	 * The tags of the command.
	 *
	 * @remarks
	 * How tags works ?
	 * @see {@link Tag}
	 */
	public tags?: Array<Tag | keyof typeof Tag>;
	/**
	 * The usage of the command.
	 *
	 * @example
	 * ```
	 * userinfo
	 * userinfo me
	 * userinfo <ID/Username/Mention of User>
	 * ```
	 *
	 * @remarks If no value is set, in most places it will use the result of the {@link Command#signatures} method.
	 */
	public usage?: string;
	/**
	 * The user permissions needed to run the command (if using the default message event).
	 *
	 * @defaultValue `['SEND_MESSAGES']`
	 */
	public userPermissions?: Array<PermissionString>;

	/**
	 * Returns the names and aliases of this command in an array.
	 */
	public get nameAndAliases() {
		return [this.name, ...(this.aliases ?? [])];
	}

	/**
	 * Returns the names and aliases of the subCommands of this command in an array flatted.
	 */
	public get subCommandsNamesAndAliases() {
		return this.subCommands.map(s => s.nameAndAliases).flat();
	}

	/**
	 * Get a user ID from different sources, only here to simplify code.
	 *
	 * @param from - Where to get ID from.
	 * @returns - The ID.
	 * @internal
	 */
	private static getSnowflake(from: Message | User | Snowflake | GuildMember): Snowflake {
		return from instanceof Message ? from.author.id : from instanceof User ? from.id : from instanceof GuildMember ? from.user.id : from;
	}

	/**
	 * Deletes a message if deletable.
	 *
	 * @param options - The options, see {@link DeleteMessageOptions}.
	 * @returns - If not deletable nothing, else the deleted message or the Node.js Timer if a timeout is set.
	 */
	public deleteMessage(options: DeleteMessageOptions) {
		if (!options.message.deletable) return;
		if (options.timeout) return setTimeout(options.message.delete, options.timeout);
		else return options.message.delete();
	}

	/**
	 * Execute the run method, but perform validations before, prefer using this method in your custom Message Event.
	 *
	 * @param ctx - The CContext.
	 * @returns - An error related to the command if any, for example : a tag not satisfied.
	 */
	public async execute(ctx: CommandContext): Promise<CommandError | undefined> {
		const error = await this.validate(ctx);
		if (error) return new CommandError(error);

		await this.run(ctx);
		for (const subCommand of this.subCommands) {
			if (subCommand.nameAndAliases.includes([...ctx.rawArgs].splice(0, subCommand.name.split(' ').length).join(' '))) {
				ctx = new SubCommandContext({
					rawArgs: ctx.rawArgs.slice(subCommand.name.split(' ').length),
					command: this,
					message: ctx.message,
					handler: ctx.handler,
					subCommand,
				});

				const subCommandError = await subCommand.execute(ctx);
				if (subCommandError) subCommandError.name = 'SubCommandError';
				return subCommandError;
			}
		}
		this.setCooldown(ctx.message);
	}

	/**
	 * Get the actual cooldown of the user for this command plus when command has been executed and how many seconds to wait.
	 *
	 * @param from - Where to get the cooldown from, can be a user/guild/message, see types.
	 * @returns - The user's cooldown.
	 */
	public getCooldown(from: Message | User | Snowflake | GuildMember): Cooldown {
		const cooldown = CommandHandler.cooldowns.get(Command.getSnowflake(from))![this.name];
		return {
			...cooldown,
			waitMore: cooldown.executedAt.getTime() + cooldown.cooldown * 1000 - Date.now(),
		};
	}

	/**
	 * Returns the invalid permissions (not presents in {@link https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS | Permissions.FLAGS}).
	 *
	 * @returns - The invalid permissions put in {@link clientPermissions} & {@link userPermissions}.
	 * @internal
	 */
	public getInvalidPermissions() {
		const permissionsFlags = [...Object.keys(Permissions.FLAGS)];

		return {
			user: this.userPermissions?.filter(permission => !permissionsFlags.includes(permission)) ?? [],
			client: this.clientPermissions?.filter(permission => !permissionsFlags.includes(permission)) ?? [],
		};
	}

	/**
	 * Returns the missing permissions from the client & user for a context.
	 *
	 * @param ctx - The context to validate permissions for.
	 * @returns - The missing permissions.
	 */
	public getMissingPermissions(ctx: CommandContext) {
		const missingPermissions: MissingPermissions = {
			client: [],
			user: [],
		};
		if (!ctx.guild || !ctx.guild.available || !ctx.textChannel) return missingPermissions;

		if (this.clientPermissions) {
			missingPermissions.client.push(
				...this.clientPermissions.filter(permission => {
					if (isPermission(permission)) return !ctx.textChannel?.permissionsFor(ctx.guild!.members.me!)?.has(permission, false);
				})
			);
		}

		if (this.userPermissions) {
			missingPermissions.user.push(
				...this.userPermissions.filter(permission => {
					if (isPermission(permission)) return !ctx.textChannel?.permissionsFor(ctx.member!)?.has(permission, false);
				})
			);
		}

		if (ctx.guild.members.me?.permissions.has('ADMINISTRATOR')) missingPermissions.client = [];
		if (ctx.member?.permissions.has('ADMINISTRATOR')) missingPermissions.user = [];

		return missingPermissions;
	}

	/**
	 * Gives the {@link tags} of this command which are not validated by the context.<br>
	 * i.e. If a command is executed on a guild and the command has the `dmOnly` Tag, it will be returned.
	 *
	 * @param ctx - The context to test tags from.
	 * @returns - Tags that are not validated by the message.
	 */
	public getMissingTags(ctx: CommandContext) {
		return Tag.check(ctx, this.tags ?? []);
	}

	/**
	 * Returns true if the user is in a cooldown for this command.
	 *
	 * @remarks
	 * If {@link cooldown} not set, this will always return `false`.
	 * @param from - From where to test if user/guild/message is in a cooldown, see types.
	 * @returns - Is user in a cooldown.
	 */
	public isInCooldown(from: Message | User | Snowflake | GuildMember) {
		const id = Command.getSnowflake(from);
		return CommandHandler.cooldowns.has(id) && Object.keys(CommandHandler.cooldowns.get(id)!).includes(this.name);
	}

	/**
	 * Returns false if {@link channels} are defined for this command but the message doesn't come from one of it.
	 *
	 * @param ctx - The context to test where it comes from.
	 * @returns - If it is on a channel required if used.
	 */
	public isInRightChannel(ctx: CommandContext) {
		if (!this.channels || this.channels.length === 0) return true;
		return !this.channels.find(ch => (typeof ch === 'string' ? ch === ctx.channel.id : ch.id === ctx.channel.id));
	}

	/**
	 * The function to run when executing the command.
	 *
	 * @remarks Use the {@link Command#execute} method if you want to have a validation before executing the run method.
	 * @param ctx - The command context.
	 */
	public abstract run(ctx: CommandContext): any;

	/**
	 * Put all the required properties in {@link CommandHandler.cooldowns} plus the `setTimeout` to remove the user from the cooldowns.
	 *
	 * @param from - What to use to select the user to set the cooldown from, can be a guild/message/member.
	 */
	public setCooldown(from: Message | User | Snowflake | GuildMember) {
		const cooldown: number = this.cooldown ?? 0;
		const id = Command.getSnowflake(from);
		if (!CommandHandler.cooldowns.has(id)) CommandHandler.cooldowns.set(id, {});
		if (this.cooldown === 0 || !!CommandHandler.cooldowns.get(id)![this.name]) return;

		CommandHandler.cooldowns.get(id)![this.name] = {
			executedAt: from instanceof Message ? from.createdAt : new Date(),
			cooldown,
		};

		setTimeout(() => delete CommandHandler.cooldowns.get(id)![this.name], cooldown * 1000);
	}

	/**
	 * Get the signature of this command.
	 *
	 * @example
	 * // The `help` command with an optional `command` commandArgument argument.
	 * ```
	 * help [command]
	 * ```
	 * @param options - The options for the signature, show the type of the arguments or the default values.
	 * @returns - The signature of this command or subCommand.
	 */
	public signature(options?: CommandSignatureOptions) {
		if (!this.arguments) return '';
		let result = this.name;

		Object.entries(this.arguments).forEach(([name, arg], index) => {
			const commandArgument = new CommandArgument(name, index, arg);
			let signature = '';
			signature += commandArgument.isSkipable ? '[' : '<';
			signature += commandArgument.name;
			if (options?.showTypes) signature += `: ${commandArgument.type.toLowerCase()}`;
			if (commandArgument.defaultValue && options?.showDefaultValues) signature += `= ${commandArgument.defaultValue}`;
			signature += commandArgument.isSkipable ? ']' : '>';
			result += ` ${signature}`;
		});

		return result;
	}

	/**
	 * Returns the signature of the command plus the signature of the subCommands of this command.
	 *
	 * @example
	 * // The `help` command with an optional `command` commandArgument argument and a `all` subCommand with no arguments.
	 * ```
	 * help [command]
	 * help all
	 * ```
	 * @param options - The options for the signature, show the type of the arguments or the default values.
	 * @returns - The signatures of the command.
	 */
	public signatures(options?: CommandSignatureOptions) {
		let result = `${this.signature(options)}\n`;
		result += this.subCommands.map(subCommand => `${this.name} ${subCommand.signature(options)}`).join(`\n`);
		return result;
	}

	/**
	 * Validate a command, returning an error if any of the validation methods are not valid.
	 *
	 * @param ctx - The CommandContext.
	 * @returns - The error if any.
	 */
	public async validate(ctx: CommandContext): Promise<CommandErrorBuilder | undefined> {
		if (this.isInCooldown(ctx.message))
			return {
				message: 'User is in a cooldown.',
				type: CommandErrorType.COOLDOWN,
				data: this.getCooldown(ctx.message),
			};

		if (!this.isInRightChannel(ctx))
			return {
				message: 'This command is not in the correct channel.',
				type: CommandErrorType.WRONG_CHANNEL,
			};

		const missingPermissions = this.getMissingPermissions(ctx);
		const missingTags = this.getMissingTags(ctx);

		if (missingPermissions.client.length)
			return {
				message: 'The bot is missing permissions.',
				type: CommandErrorType.CLIENT_MISSING_PERMISSIONS,
				data: missingPermissions.client.sort(),
			};
		if (missingPermissions.user.length)
			return {
				message: 'User is missing permissions.',
				type: CommandErrorType.USER_MISSING_PERMISSIONS,
				data: missingPermissions.client.sort(),
			};

		if (missingTags.length)
			return {
				message: 'There are missing tags for the message.',
				type: CommandErrorType.MISSING_TAGS,
				data: missingTags,
			};

		if (Object.values(this.arguments).length) {
			const argsMap = await ctx.resolveArguments();
			const args = [...(argsMap?.values() ?? [])];
			const argsError: CommandError | undefined = args.find(arg => arg instanceof CommandError);
			if (argsError) {
				return {
					message: argsError.message,
					data: argsError.data,
					type: argsError.type,
				};
			}
		}
	}

	/**
	 *
	 */
	protected subCommand(name: string, callback: RunSubCommandFunction): void;
	/**
	 *
	 */
	protected subCommand(name: string, options: SubCommandOptions, callback: RunSubCommandFunction): void;
	/**
	 * Creates a new SubCommand for the command.
	 *
	 * @remarks Make sure to creates the Subcommands in the {@link Command#registerSubCommands} method.
	 * @param name - The name of the SubCommand.
	 * @param options - The options of the Subcommand.
	 * @param callback - The callback executed when the SubCommand is executed.
	 * @returns - The SubCommand itself.
	 */
	protected subCommand(name: string, options: SubCommandOptions | RunSubCommandFunction, callback?: RunSubCommandFunction) {
		if (this.subCommands.map(c => c.name).includes(name)) return;

		if (typeof options !== 'object') {
			callback = options;
			options = {};
		}

		const subCommand = new SubCommand(name, options, callback as RunSubCommandFunction);
		this.subCommands.push(subCommand);

		Logger.comment(`Loaded subcommand '${this.name} ${name}'.`, 'SubCommandLoading');
		return subCommand;
	}
}

/**
 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/commands/subcommands}
 * @remarks
 * This class is not in the SubCommand file because otherwise it won't compile because of circular because of the {@link Command#subCommands} property.
 */
export class SubCommand extends Command {
	/**
	 * The name of the SubCommand.
	 */
	public readonly name: string;

	/**
	 * The method executed when the SubCommand is executed.
	 *
	 * @param ctx - The SubCommandContext.
	 * @returns - Any.
	 */
	public override run(ctx: SubCommandContext) {
		return this.runFunction(ctx);
	}

	/**
	 * The function executed when the SubCommand is executed.
	 */
	public readonly runFunction: RunSubCommandFunction;

	/**
	 * Creates a new SubCommand.
	 *
	 * @remarks Make sure to creates the Subcommands in the {@link Command#registerSubCommands} method.
	 * @param name - The name of the SubCommand.
	 * @param options - The options of the Subcommand.
	 * @param runFunction - The callback executed when the SubCommand is executed.
	 */
	public constructor(name: string, options: SubCommandOptions = {}, runFunction: RunSubCommandFunction) {
		super();
		this.name = name;
		this.aliases = options.aliases;
		this.channels = options.channels;
		this.description = options.description;
		this.tags = options.tags;
		this.usage = options.usage;
		this.arguments = options.arguments ?? {};
		this.runFunction = runFunction;
	}
}
