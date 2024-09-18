import {SlashCommandBuilder, SlashCommandSubcommandBuilder} from '@discordjs/builders';
import type {APIApplicationCommandSubcommandOption, RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v9';
import {Permissions, type PermissionString} from 'discord.js';
import {Logger} from '../../helpers/Logger.js';
import type {SlashCommandArguments} from '../arguments/CommandArgument.js';

import type {SlashCommandContext} from '../contexts/interactions/SlashCommandContext.js';
import type {SubSlashCommandContext} from '../contexts/interactions/SubSlashCommandContext.js';
import {CommandHandlerError} from '../errors/CommandHandlerError.js';
import {ApplicationCommand} from './ApplicationCommand.js';
import type {RunSubSlashCommandFunction, SubSlashCommandOptions} from './SubSlashCommand.js';

/**
 * An interface to put optional methods for the {@link SlashCommand} class.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SlashCommand<T extends SlashCommandArguments = SlashCommandArguments> {
	/**
	 * Override this method to register your {@link subCommands}.
	 */
	registerSubCommands?(): void;
}

export abstract class SlashCommand<T extends SlashCommandArguments = SlashCommandArguments> extends ApplicationCommand {
	/**
	 * The arguments of the command.
	 * You can put your own custom arguments, but you must add the type to the {@link ArgumentType | argument types}.
	 */
	public arguments: T = {} as T;
	/**
	 * The description of the slash command.
	 */
	public abstract readonly description: string;
	public readonly nsfw: boolean = false;
	/**
	 * The SubCommands of this command.
	 *
	 * @remarks Register SubCommands using the {@link Command#registerSubCommands} method.
	 */
	public subCommands: SubSlashCommand<any>[] = [];
	public readonly userPermissions: PermissionString[] = [];

	public abstract override run(ctx: SlashCommandContext<this>): Promise<unknown>;

	/**
	 * Returns the JSON of the SlashCommand.
	 *
	 * @returns - The JSON of the SlashCommand.
	 */
	public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
		const commandsJSONBody = new SlashCommandBuilder().setName(this.name).setDescription(this.description).setNSFW(this.nsfw);

		if (this.userPermissions.length > 0) {
			commandsJSONBody.setDefaultMemberPermissions(
				this.userPermissions
					.map(name => {
						try {
							return Permissions.resolve(name);
						} catch (e) {
							Logger.warn(`Permission ${Logger.setColor('orange', name)} is not valid: ${e instanceof Error ? e.message : String(e)}`);
							return 0n;
						}
					})
					.reduce((a, b) => a | b, 0n)
			);
		}

		const argumentsAsJSONs = Object.entries(this.arguments)
			.filter(([name, arg]) => {
				if (arg.canBeSlashCommandArgument()) return true;

				Logger.warn(
					`Argument ${Logger.setColor('blue', name)} of command ${Logger.setColor('green', this.name)} can't be used as a slash command argument.`
				);
				return false;
			})
			.map(([name, argument]) => argument.toSlashCommandArgument(name));

		const subCommands = this.subCommands.map(subCommand => subCommand.toJSONOption());

		return {
			...commandsJSONBody.toJSON(),
			options: [...argumentsAsJSONs, ...subCommands],
		};
	}

	/**
	 * Creates a new SubCommand for the command.
	 *
	 * @remarks Make sure to create the Subcommands in the {@link Command#registerSubCommands} method.
	 * @param name - The name of the SubCommand.
	 * @param options - The options of the Subcommand.
	 * @param callback - The callback executed when the SubCommand is executed.
	 * @returns - The SubCommand itself.
	 *
	 * @throws CommandHandlerError If the command has arguments.
	 */
	protected subCommand<T extends SubSlashCommand<A>, A extends SlashCommandArguments = T['arguments']>(
		name: string,
		options: SubSlashCommandOptions<A>,
		callback: RunSubSlashCommandFunction<T>
	) {
		if (Object.keys(this.arguments).length > 0) {
			throw new CommandHandlerError(`You can't create a subcommand if the command has arguments, slash command ${this.name}.`, 'SubCommandCreation');
		}
		if (this.subCommands.map(c => c.name).includes(name)) return;

		const subCommand = new SubSlashCommand(name, options, callback);
		this.subCommands.push(subCommand);

		Logger.comment(`Loaded subcommand '${this.name} ${name}'.`, 'SubCommandLoading');
		return subCommand;
	}
}

/**
 * A SubCommand of a SlashCommand.
 *
 * @remarks
 * This class is not in the SubSlashCommand file because otherwise it won't compile because of circular because of the {@link SlashCommand.subCommands} property.
 */
export class SubSlashCommand<T extends SlashCommandArguments> extends SlashCommand<T> {
	/**
	 * The description of the slash command.
	 */
	public readonly description: string;
	/**
	 * The name of the SubCommand.
	 */
	public readonly name: string;

	/**
	 * The function executed when the SubCommand is executed.
	 *
	 * @param ctx - The context of the command.
	 * @returns - The result of the command.
	 */
	//@ts-expect-error `ctx` is not meant to be the same type as in SlashCommand.
	public override run(ctx: SubSlashCommandContext<this>) {
		return this.runFunction(ctx);
	}

	/**
	 * The function executed when the SubCommand is executed.
	 */
	public readonly runFunction: RunSubSlashCommandFunction<this>;

	/**
	 * Creates a new SubCommand.
	 *
	 * @remarks Make sure to create the Subcommands in the {@link Command#registerSubCommands} method.
	 * @param name - The name of the SubCommand.
	 * @param options - The options of the Subcommand.
	 * @param runFunction - The callback executed when the SubCommand is executed.
	 */
	public constructor(name: string, options: SubSlashCommandOptions<T>, runFunction: RunSubSlashCommandFunction<any>) {
		super();
		this.name = name;
		this.description = options.description;
		this.arguments = options.arguments ?? ({} as T);
		this.runFunction = runFunction;
	}

	/**
	 * Returns the JSON of the SubCommand.
	 *
	 * @returns - The JSON of the SubCommand.
	 */
	public toJSONOption(): APIApplicationCommandSubcommandOption {
		const subCommandJSONBody = new SlashCommandSubcommandBuilder().setName(this.name).setDescription(this.description);

		const argumentsAsJSONs = Object.entries(this.arguments)
			.filter(([, arg]) => arg.canBeSlashCommandArgument())
			.map(([name, argument]) => argument.toSlashCommandArgument(name));

		return {
			...subCommandJSONBody.toJSON(),
			options: argumentsAsJSONs,
		};
	}
}
