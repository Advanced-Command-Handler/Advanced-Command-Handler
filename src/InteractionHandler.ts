import {Collection} from 'discord.js';
import {EventEmitter} from 'events';
import {promises as fsPromises} from 'fs';
import {join} from 'path';
import packageJson from '../package.json' with {type: 'json'};
import type {AdvancedClient} from './classes/AdvancedClient.js';
import type {CommandHandlerError} from './classes/errors/CommandHandlerError.js';
import type {Event} from './classes/Event.js';
import type {SlashCommand} from './classes/interactions/SlashCommand.js';
import {CommandHandler} from './CommandHandler.js';
import {Logger} from './helpers/Logger.js';
import type {Constructor, MaybeSlashCommand} from './types.js';

export namespace InteractionHandler {
	/**
	 * The options for the default events.
	 */
	interface DefaultEventsOptions {
		exclude?: string[];
	}

	/**
	 * The options for the default commands.
	 */
	interface DefaultCommandsOptions {
		exclude?: string[];
	}

	/**
	 * The CommandHandler events.
	 *
	 * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter | EventEmitter}.
	 */
	export type InteractionHandlerEvents = {
		/**
		 * The event executed when a CommandHandlerError is created.
		 *
		 * @remarks You need to add a listener to this event for every bots otherwise it will crash in some places with a weird error.
		 * @see {@link https://nodejs.org/api/errors.html#errors_err_unhandled_error}
		 */
		error: [CommandHandlerError];
		/**
		 * The event executed when loading a SlashCommand.
		 */
		loadSlashCommand: [SlashCommand];
	};

	/**
	 * The version of the handler.
	 */
	export const version = packageJson.version;
	/**
	 * The event emitter for the CommandHandler.
	 *
	 * @eventProperty
	 */
	export const emitter = new EventEmitter();

	/**
	 * The client of the handler, null before {@link launch} function executed.
	 */
	export let client: AdvancedClient | null = null;
	export let commandsDir = '';

	export let usesDefaultEvents = true;
	export let defaultEventsOptions: DefaultEventsOptions | undefined = undefined;
	export let usesDefaultCommands = true;
	export let defaultCommandsOptions: DefaultCommandsOptions | undefined = undefined;
	/**
	 * The commands registered by the CommandHandler.
	 */
	export const commands = new Collection<string, SlashCommand>();
	/**
	 * The events registered by the EventHandler.
	 *
	 * @remarks
	 * These events may not be bound to the {@link client}.
	 */
	export const events = new Collection<string, Event>();

	/**
	 * Find a command by name or alias.
	 *
	 * @param name - The name or alias of the command.
	 * @returns - The command found or `undefined`.
	 */
	export function findCommand(name: string) {
		return commands.find(c => c.name === name);
	}

	/**
	 * Execute the event you want from the {@link emitter | listener} throughout the CommandHandler.
	 *
	 * @typeParam K - Event names of the CommandHandler listener.
	 * @param eventName - The event name.
	 * @param args - The arguments to pass.
	 */
	export function emit<K extends keyof InteractionHandlerEvents>(eventName: K, ...args: InteractionHandlerEvents[K]) {
		emitter.emit(eventName, args);
	}

	/**
	 * Adds a listener for the {@link eventName} event.
	 *
	 * @typeParam K - Event names of the CommandHandler listener.
	 * @param eventName - The event name.
	 * @param fn - The callback to execute.
	 */
	export function on<K extends keyof InteractionHandlerEvents>(eventName: K, fn: (...args: InteractionHandlerEvents[K]) => void) {
		emitter.on(eventName, fn as (...args: any[]) => void);
	}

	/**
	 * Adds a one-time listener for the {@link eventName} event.
	 *
	 * @typeParam K - Event names of the CommandHandler listener.
	 * @param eventName - The event name.
	 * @param fn - The callback to execute.
	 */
	export function once<K extends keyof InteractionHandlerEvents>(eventName: K, fn: (...args: InteractionHandlerEvents[K]) => void) {
		emitter.once(eventName, fn as (...args: any[]) => void);
	}

	/**
	 * Load a command from the directory & filename.
	 *
	 * @param path - The path of the command folder.
	 * @param name - The name of the command including the extension.
	 * @returns - The command itself.
	 */
	export async function loadCommand(path: string, name: string) {
		const finalPath = join(process.cwd(), path, name);
		const onWindows = process.platform === 'win32';

		let command: MaybeSlashCommand = await import(onWindows ? `file:///${finalPath}` : finalPath);
		if ('default' in command) command = command.default;
		if (command.constructor.name === 'Object') command = Object.values(command)[0];

		const instance = new (command as Constructor<SlashCommand>)();
		if (!instance) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);

		commands.set(instance.name, instance);
		emit('loadSlashCommand', instance);
		Logger.comment(`Loading the slash command : ${Logger.setColor('gold', name)}`, 'Loading');

		return instance;
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
		Logger.info('Loading slash commands.', 'Loading');
		Logger.comment(`Categories : (${dirs.length})`, 'Loading');
		if (dirs.length) {
			for (const dir of dirs) {
				const commandsPath = join(path, dir);
				const files = await fsPromises.readdir(commandsPath);
				if (!files.length) continue;
				Logger.comment(`Slash Commands in the category '${dir}' : (${files.length})`, 'Loading');

				for (const file of files) {
					await loadCommand(commandsPath, file);
				}
			}
		}
		Logger.info(`${commands.size} slash commands loaded.`, 'Loading');

		if (!usesDefaultCommands) return;
		const options = defaultCommandsOptions;
		const defaultSlashCommands = await import('./defaults/slashCommands/index.js');

		Logger.info('Loading default slash commands.', 'Loading');

		for (const slashCommand of Object.values(defaultSlashCommands)) {
			const instance = new slashCommand();
			if (options?.exclude?.includes(instance.name)) continue;
			commands.set(instance.name, instance);

			Logger.comment(`Default ${Logger.setColor('green', instance.name)} command loaded.`, 'Loading');
		}
		Logger.info(`Default commands loaded. (${Object.keys(defaultSlashCommands).length})`, 'Loading');
	}

	/**
	 * Add the defaults events to your CommandHandler.
	 *
	 * @remarks
	 * Must use after {@link CommandHandler.create}.
	 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/defaults | Default Events}
	 * @param options - The options for the default events.
	 * @returns - Itself so that afterward you can chain with other functions.
	 */
	export function useDefaultEvents(options?: DefaultEventsOptions) {
		usesDefaultEvents = true;
		defaultEventsOptions = options;
		return InteractionHandler;
	}

	/**
	 * Add the defaults commands to your CommandHandler.
	 *
	 * @remarks
	 * Must use after {@link CommandHandler.create}.
	 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/defaults | Default Commands}
	 * @param options - The options for the default commands.
	 * @returns - Itself so that afterward you can chain with other functions.
	 */
	export function useDefaultCommands(options?: DefaultCommandsOptions) {
		usesDefaultCommands = true;
		defaultCommandsOptions = options;
		return InteractionHandler;
	}
}
