import {ClientOptions, Collection, Message, Snowflake} from 'discord.js';
import {EventEmitter} from 'events';
import {promises as fsPromises} from 'fs';
import {join} from 'path';
import * as defaultCommands from './defaults/commands/index';
import * as defaultEvents from './defaults/events/index';
import {Logger} from './utils/Logger';
import {AdvancedClient} from './classes/AdvancedClient';
import {Command} from './classes/Command';
import {CommandHandlerError} from './classes/CommandHandlerError';
import {Event} from './classes/Event';

export namespace CommandHandler {
	export interface CreateCommandHandlerOptions {
		commandsDir: string;
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
		 * There are two ones because the `!` is only here in DM to indicate that that's a user mention and not a member mention.
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

	export const version: string = require('../package.json').version;
	/**
	 * The event emitter for the CommandHandler.
	 *
	 * @eventProperty
	 */
	export const emitter: EventEmitter = new EventEmitter();
	export const commands: Collection<string, Command> = new Collection();
	/**
	 * The cooldowns mapped by ID and cooldown user.
	 * **A simple explication** :
	 *
	 * When a user executes a command with a cooldown, a new value is added.
	 * ```ts
	 * [ID]: {
	 *    [commandName]: {
	 *        executedAt: Date,
	 *        cooldown: [command cooldown]
	 *    }
	 * }
	 * ```
	 */
	export const cooldowns: Collection<Snowflake, CooldownUser> = new Collection();
	export const events: Collection<string, Event> = new Collection();
	export let commandsDir: string = '';
	export let eventsDir: string = '';
	export let owners: string[] = [];
	export let prefixes: string[] = [];

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
	 * Add the defaults events to your CommandHandler.
	 *
	 * @remarks
	 * Must use after {@link CommandHandler.create}.
	 *
	 * @returns Itself.
	 */
	export function setDefaultEvents(): typeof CommandHandler {
		Logger.info('Loading default events.', 'Loading');
		for (let event of Object.values(defaultEvents)) {
			events.set(event.default.name, event.default);
			Logger.comment(`Default ${Logger.setColor('green', event.default.name) + Logger.setColor('comment', ' event loaded.')}`, 'Loading');
		}
		Logger.info(`Default events loaded. (${Object.values(defaultEvents).length})`, 'Loading');

		return CommandHandler;
	}

	/**
	 * Add the defaults commands to your CommandHandler.
	 *
	 * @remarks
	 * Must use after {@link CommandHandler.create}.
	 *
	 * @returns Itself.
	 */
	export function setDefaultCommands(): typeof CommandHandler {
		Logger.info('Loading default commands.', 'Loading');
		for (let command of Object.values(defaultCommands)) {
			commands.set(command.default.name, command.default);
			Logger.comment(`Default ${Logger.setColor('green', command.default.name) + Logger.setColor('comment', ' command loaded.')}`, 'Loading');
		}
		Logger.info(`Default commands loaded. (${Object.keys(defaultCommands)})`, 'Loading');

		return CommandHandler;
	}

	/**
	 * Creates a new CommandHandler, wrap up the last one.
	 *
	 * @param options - Options for creating a new CommandHandler.
	 * @returns Itself.
	 */
	export function create(options: CreateCommandHandlerOptions): typeof CommandHandler {
		Logger.log(`Advanced Command Handler ${version} by Ayfri.`, 'Loading', 'red');
		commandsDir = options.commandsDir;
		eventsDir = options.eventsDir;
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
	 * @returns Itself in a promise.
	 */
	export async function launch(options: LaunchCommandHandlerOptions): Promise<typeof CommandHandler> {
		client = new AdvancedClient(options.token, options.clientOptions ?? {});
		emit('launch');

		try {
			await loadCommands(commandsDir ?? '');
			await loadEvents(eventsDir ?? '');

			Logger.comment('Binding events to client.', 'Binding');
			events.forEach(event => {
				event.bind(client!!);
			});

			Logger.info(`${client?.eventNames().length ?? 0} events loaded & bind.`, 'Loading');
		} catch (e) {
			Logger.error(e.stack, 'Loading');
		}

		await client.login(options.token);
		prefixes.push(`<@${client?.user?.id}> `);
		prefixes.push(`<@!${client?.user?.id}> `);
		owners.push((await client.fetchApplication()).owner?.id ?? '');
		emit('launched');
		return CommandHandler;
	}

	/**
	 * Get the prefix from the prefixes defined in {@link CommandHandler.launch} or null.
	 *
	 * @param message - The message to get the prefix for.
	 * @returns The prefix found or null if not.
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
		let command: Command | (Command & {default: any}) = await import(join(process.cwd(), `./${path}/${name}`));
		if ('default' in command && command.default instanceof Command) command = command.default;
		if (!command) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		if (command.category === 'None') command.category = path.split(/[\\/]/).pop()!;

		const invalidPermissions = command.getInvalidPermissions();
		if (invalidPermissions.client.length > 0)
			throw new CommandHandlerError(`Invalid client permissions for '${command.name}' command.\nInvalid Permissions: '${invalidPermissions.client.sort().join(',')}'`, 'Loading');
		if (invalidPermissions.user.length > 0)
			throw new CommandHandlerError(`Invalid user permissions for '${command.name}' command.\nInvalid Permissions: '${invalidPermissions.user.sort().join(',')}'`, 'Loading');

		commands.set(command.name, command);
		emit('loadCommand', command);
		Logger.comment(`Loading the command : ${Logger.setColor('gold', name)}`, 'Loading');
	}

	/**
	 * Load all the commands from a directory.
	 *
	 * @remarks
	 * The path must be a directory containing sub-directories.
	 *
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
				let event: Event | (Event & {default: any}) = await import(join(process.cwd(), `${path}/${file}`));
				if ('default' in event && event.default instanceof Event) event = event.default;
				if (!event) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${file}`);
				events.set(event.name, event);

				Logger.comment(`Event ${event.name} loading : ${Logger.setColor('gold', `${file.split('.')[0]}.js`)}`, 'Loading');
			}
		}
	}
}
