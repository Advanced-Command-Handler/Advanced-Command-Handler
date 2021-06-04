import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import {ClientOptions, Collection, Message, Snowflake, Team} from 'discord.js';
import {EventEmitter} from 'events';
import {promises as fsPromises} from 'fs';
import {join} from 'path';
import {AdvancedClient, Command, CommandHandlerError, Event} from './classes';
import * as defaultCommands from './defaults/commands/index';
import * as defaultEvents from './defaults/events/index';
import {MaybeCommand, MaybeEvent} from './types';
import {Logger} from './utils';

dayjs.extend(dayjsDuration);
dayjs.duration('a');

export {dayjs};

export namespace CommandHandler {
	export interface CreateCommandHandlerOptions {
		/**
		 * The directory of your commands.
		 */
		commandsDir: string;
		/**
		 * The directory of your events.
		 */
		eventsDir: string;
		/**
		 * The owners IDs from discord of the bot.
		 */
		owners?: string[];
		/**
		 * The prefixes for the CommandHandler.
		 *
		 * @remarks
		 * There are two default prefixes that are `<@!botID>` & `<@botID>`, they're the text versions of mentions in Discord.
		 * There are two ones because the `!` is only here in private messages to indicate that that's a user mention and not a member mention.
		 */
		prefixes?: string[];
	}

	/**
	 * @internal
	 */
	export interface CommandCooldown {
		executedAt: Date;
		cooldown: number;
	}

	/**
	 * @internal
	 */
	export type CooldownUser = {[k: string]: CommandCooldown};

	/**
	 * Options for launching the CommandHandler.
	 */
	export interface LaunchCommandHandlerOptions {
		/**
		 * The token of your bot.
		 */
		token: string;
		/**
		 * The client options, see {@link https://discord.js.org/#/docs/main/stable/typedef/ClientOptions | ClientOptions}.
		 */
		clientOptions?: ClientOptions;
	}

	/**
	 * The CommandHandler events.
	 *
	 * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter | EventEmitter}.
	 */
	export type CommandHandlerEvents = {
		/**
		 * The event executed when creating the CommandHandler.
		 */
		create: [CreateCommandHandlerOptions];
		/**
		 * The event executed when a CommandHandlerError is created.
		 */
		error: [CommandHandlerError];
		/**
		 * The event executed when the CommandHandler starts its launch.
		 */
		launch: [];
		/**
		 * The event executed when loading a Command.
		 */
		loadCommand: [Command];
		/**
		 * The event executed when loading an Event.
		 */
		loadEvent: [Event];
		/**
		 * The event executed when the CommandHandler has finished launching..
		 */
		launched: [];
	};

	/**
	 * The version of the handler.
	 */
	export const version: string = require('../package.json').version;
	/**
	 * The event emitter for the CommandHandler.
	 *
	 * @eventProperty
	 */
	export const emitter: EventEmitter = new EventEmitter();
	/**
	 * The commands registered by the CommandHandler.
	 */
	export const commands: Collection<string, Command> = new Collection();
	/**
	 * The cooldowns mapped by ID and cooldown user.
	 *
	 * <strong>A simple explication</strong> :<br>
	 * When a user executes a command with a cooldown, a new value is added.
	 * ```typescript
	 * [ID]: {
	 *    [commandName]: {
	 *        executedAt: Date,
	 *        cooldown: [command cooldown]
	 *    }
	 * }
	 * ```
	 */
	export const cooldowns: Collection<Snowflake, CooldownUser> = new Collection();
	/**
	 * The events registered by the CommandHandler.
	 *
	 * @remarks
	 * These events may not be bound to the {@link client}.
	 */
	export const events: Collection<string, Event> = new Collection();
	export let commandsDir: string = '';
	export let eventsDir: string = '';
	export let owners: string[] = [];
	export let prefixes: string[] = [];
	/**
	 * The client of the handler, null before {@link launch} function executed.
	 */
	export let client: AdvancedClient | null = null;

	/**
	 * @typeParam K - Events names for CommandHandler.
	 * @param eventName - The event name.
	 * @param fn - The callback to execute.
	 */
	export function on<K extends keyof CommandHandlerEvents>(eventName: K, fn: (listener: CommandHandlerEvents[K]) => void): void {
		emitter.on(eventName, fn);
	}

	/**
	 * @param eventName - The event name.
	 * @param args - The arguments to pass.
	 */
	export function emit<K extends keyof CommandHandlerEvents>(eventName: K, ...args: CommandHandlerEvents[K]) {
		emitter.emit(eventName, args);
	}

	/**
	 * Returns the list of names and aliases of all commands, useful to find a command by name.
	 *
	 * @returns - All the names and aliases in a flat array.
	 */
	export function getCommandAliasesAndNames() {
		return commands.map(c => [c.name, ...(c.aliases ?? [])]).flat();
	}

	/**
	 * Find a command by name or alias.
	 *
	 * @param name - The name or alias of the command.
	 * @returns - The command found or `undefined`.
	 */
	export function findCommand(name: string) {
		return commands.find(c => c.name === name || (c.aliases ?? []).includes(name));
	}

	/**
	 * Add the defaults events to your CommandHandler.
	 *
	 * @remarks
	 * Must use after {@link CommandHandler.create}.
	 * @returns - It returns itself so that afterward you can use the other functions.
	 */
	export function setDefaultEvents(): typeof CommandHandler {
		Logger.info('Loading default events.', 'Loading');
		for (let event of Object.values(defaultEvents)) {
			const instance = new event();
			events.set(instance.name, instance);
			Logger.comment(`Default ${Logger.setColor('green', instance.name) + Logger.setColor('comment', ' event loaded.')}`, 'Loading');
		}
		Logger.info(`Default events loaded. (${Object.values(defaultEvents).length})`, 'Loading');

		return CommandHandler;
	}

	/**
	 * Add the defaults commands to your CommandHandler.
	 *
	 * @remarks
	 * Must use after {@link CommandHandler.create}.
	 * @returns - It returns itself so that afterward you can use the other functions .
	 */
	export function setDefaultCommands(): typeof CommandHandler {
		Logger.info('Loading default commands.', 'Loading');
		for (let command of Object.values(defaultCommands)) {
			const instance = new command();
			commands.set(instance.name, instance);
			Logger.comment(`Default ${Logger.setColor('green', instance.name) + Logger.setColor('comment', ' command loaded.')}`, 'Loading');
		}
		Logger.info(`Default commands loaded. (${Object.keys(defaultCommands).length})`, 'Loading');

		return CommandHandler;
	}

	/**
	 * Creates a new CommandHandler, wrap up the last one.
	 *
	 * @param options - Options for creating a new CommandHandler.
	 * @returns - It returns itself so that afterward you can use the other functions.
	 */
	export function create(options: CreateCommandHandlerOptions): typeof CommandHandler {
		Logger.log(`Advanced Command Handler ${version} by Ayfri.`, 'Loading', 'red');
		commandsDir = options.commandsDir ?? '';
		eventsDir = options.eventsDir ?? '';
		owners = options.owners ?? [];
		prefixes = options.prefixes ?? [];

		if (!commandsDir) Logger.warn("No 'commandsDir' specified, commands apart default commands won't load.");
		if (!eventsDir) Logger.warn("No 'eventsDir' specified, events apart default events won't load.");

		process.on('warning', error => Logger.error(`An error occurred. \n${error.stack}`));
		process.on('uncaughtException', error => Logger.error(`An error occurred. \n${error.stack}`));
		emit('create', options);

		return CommandHandler;
	}

	/**
	 * Launches the CommandHandler, log in the client and load commands/events.
	 *
	 * @param options - Options for launching the CommandHandler, see {@link CreateCommandHandlerOptions}.
	 * @returns - Itself in a promise.
	 */
	export async function launch(options: LaunchCommandHandlerOptions): Promise<typeof CommandHandler> {
		client = new AdvancedClient(options.token, options.clientOptions ?? {});
		emit('launch');

		try {
			await loadCommands(commandsDir);
			await loadEvents(eventsDir);

			Logger.comment('Loading subcommands.', 'SubCommandLoading');
			commands.forEach(c => c.registerSubCommands?.(CommandHandler));
			Logger.comment('Binding events to client.', 'Binding');
			events.forEach(event => event.bind(client!!));

			Logger.info(`${client?.eventNames().length ?? 0} events loaded & bind.`, 'Loading');
		} catch (e) {
			Logger.error(e.stack, 'Loading');
		}

		await client.login(options.token);
		prefixes.push(`<@${client?.user?.id}> `);
		prefixes.push(`<@!${client?.user?.id}> `);
		const appOwner = (await client.fetchApplication()).owner;
		if (appOwner) {
			if (appOwner instanceof Team) {
				owners.push(...appOwner.members.array().map(m => m.id));
			} else {
				owners.push(appOwner.id);
			}
		}
		emit('launched');
		return CommandHandler;
	}

	/**
	 * Get the prefix from the prefixes defined in {@link CommandHandler.launch} or null.
	 *
	 * @param message - The message to get the prefix for.
	 * @returns - The prefix found or null if not.
	 */
	export function getPrefixFromMessage(message: Message): string | null {
		return prefixes.find(prefix => message.content.startsWith(prefix)) ?? null;
	}

	/**
	 * Load a command from the directory & filename.
	 *
	 * @param path - The directory to get the command from.
	 * @param name - The filename of the command.
	 */
	export async function loadCommand(path: string, name: string) {
		let command: MaybeCommand = await import(join(process.cwd(), `./${path}/${name}`));
		if ('default' in command) command = command.default;

		const instance = new command();
		if (!instance) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		if (!instance.category) instance.category = path.split(/[\\/]/).pop()!;

		const invalidPermissions = instance.getInvalidPermissions();
		if (invalidPermissions.client.length > 0)
			throw new CommandHandlerError(`Invalid client permissions for '${instance.name}' command.\nInvalid Permissions: '${invalidPermissions.client.sort().join(',')}'`, 'Loading');
		if (invalidPermissions.user.length > 0)
			throw new CommandHandlerError(`Invalid user permissions for '${instance.name}' command.\nInvalid Permissions: '${invalidPermissions.user.sort().join(',')}'`, 'Loading');

		commands.set(instance.name, instance);
		emit('loadCommand', instance);
		Logger.comment(`Loading the command : ${Logger.setColor('gold', name)}`, 'Loading');
	}

	/**
	 * Load all the commands from a directory.
	 *
	 * @remarks
	 * The path must be a directory containing sub-directories.
	 * @param path - The path of the directory to load the commands from.
	 */
	export async function loadCommands(path: string) {
		if (!path) return;
		const dirs = await fsPromises.readdir(path);
		Logger.info('Loading commands.', 'Loading');
		Logger.comment(`Categories : (${dirs.length})`, 'Loading');
		if (dirs) {
			for (const dir of dirs) {
				const files = await fsPromises.readdir(join(process.cwd(), `${path}/${dir}`));
				if (files.length === 0) continue;
				Logger.comment(`Commands in the category '${dir}' : (${files.length})`, 'Loading');

				for (const file of files) {
					await loadCommand(`${path}/${dir}`, file);
				}
			}
		}
		Logger.info(`${commands.size} commands loaded.`, 'Loading');
	}

	/**
	 * Load all the events from a directory.
	 *
	 * @param path - The path of the directory to load the events from.
	 */
	export async function loadEvents(path: string) {
		if (!path) return;
		const files = await fsPromises.readdir(path);
		Logger.info('Loading events.', 'Loading');
		Logger.comment(`Events : (${files.length})`, 'Loading');

		if (files) {
			for (const file of files) {
				let event: MaybeEvent = await import(join(process.cwd(), `${path}/${file}`));
				if ('default' in event) event = event.default;

				const instance = new event();
				if (!event) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${file}`);
				events.set(instance.name, instance);

				Logger.comment(`Event ${instance.name} loading : ${Logger.setColor('gold', `${file.split('.')[0]}.js`)}`, 'Loading');
			}
		}
	}

	/**
	 * Unloads an event.
	 *
	 * @param name - The event to unload.
	 */
	export function unloadEvent(name: string) {
		if (events.delete(name)) Logger.info(`${name} event unloaded.`, 'UnLoading');
		else Logger.warn(`${name} event not found.`, 'UnLoading');
	}

	/**
	 * Unloads a command.
	 *
	 * @param name - The command to unload.
	 */
	export function unloadCommand(name: string) {
		if (commands.delete(name)) Logger.info(`${name} command unloaded.`, 'UnLoading');
		else Logger.warn(`${name} command not found.`, 'UnLoading');
	}
}
