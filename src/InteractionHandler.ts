import {Collection} from 'discord.js';
import {EventEmitter} from 'events';
import {promises as fsPromises} from 'fs';
import {join} from 'path';
import packageJson from '../package.json' with {type: 'json'};
import type {CommandHandlerError} from './classes/errors/CommandHandlerError.js';
import type {Event} from './classes/Event.js';
import type {ApplicationCommand} from './classes/interactions/ApplicationCommand.js';
import {SlashCommand} from './classes/interactions/SlashCommand.js';
import {CommandHandler} from './CommandHandler.js';
import {Logger} from './helpers/Logger.js';
import type {Constructor} from './types.js';
import {loadClass} from './utils/load.js';

export namespace InteractionHandler {
	/**
	 * The options for the InteractionHandler.
	 */
	interface InteractionHandlerOptions {
		/**
		 * The directory where the slash commands are located.
		 */
		slashCommandsDir: string;
	}

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
	 * The options for launching the interaction handler.
	 */
	interface LaunchInteractionHandlerOptions {
		/**
		 * The directory where the commands are located.
		 */
		commandsDir: string;
		/**
		 * The guild ID to launch the interaction handler.
		 */
		guildId?: string;
		/**
		 * The token of your bot.
		 */
		token: string;
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
		 * The event executed when the InteractionHandler starts its launch.
		 */
		launch: [];
		/**
		 * The event executed when the InteractionHandler is launched.
		 */
		launched: [];
		/**
		 * The event executed when loading a SlashCommand.
		 */
		loadSlashCommand: [SlashCommand];
		/**
		 * The event executed when registering a SlashCommand to Discord.
		 */
		registerSlashCommand: [SlashCommand];
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
	export let slashCommandsDir = '';

	export let usesDefaultEvents = true;
	export let defaultEventsOptions: DefaultEventsOptions | undefined = undefined;
	export let usesDefaultCommands = true;
	export let defaultCommandsOptions: DefaultCommandsOptions | undefined = undefined;
	/**
	 * The commands registered by the CommandHandler.
	 */
	export const commands = new Collection<string, ApplicationCommand>();
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
	 * Creates the InteractionHandler and sets its options.
	 *
	 * @param options - The options for the InteractionHandler.
	 * @returns - The InteractionHandler itself.
	 */
	export function create(options: InteractionHandlerOptions) {
		slashCommandsDir = options.slashCommandsDir;
		return InteractionHandler;
	}

	/**
	 * Load a command from the directory & filename.
	 *
	 * @param path - The path of the command folder.
	 * @param name - The name of the command including the extension.
	 * @returns - The command itself.
	 */
	export async function loadSlashCommand(path: string, name: string) {
		const command = await loadClass<SlashCommand>(path, name);
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
	export async function loadSlashCommands(path: string) {
		if (!path) return;
		const dirs = await fsPromises.readdir(path);
		Logger.info('Loading slash commands.', 'Loading');
		Logger.comment(`Categories : (${dirs.length})`, 'Loading');

		for (const dir of dirs) {
			const commandsPath = join(path, dir);
			const files = await fsPromises.readdir(commandsPath);
			if (!files.length) continue;
			Logger.comment(`Slash Commands in the category '${dir}' : (${files.length})`, 'Loading');

			for (const file of files) {
				await loadSlashCommand(commandsPath, file);
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

			Logger.comment(`Default ${Logger.setColor('green', instance.name)} slash command loaded.`, 'Loading');
		}
		Logger.info(`Default commands loaded. (${Object.keys(defaultSlashCommands).length})`, 'Loading');
	}

	/**
	 * Launches the InteractionHandler.
	 */
	export async function launch() {
		emit('launch');

		await loadSlashCommands(slashCommandsDir);

		while (!CommandHandler.launched) {
			await new Promise(resolve => setTimeout(resolve, 200));
		}

		client = CommandHandler.client;
		rest.setToken(client!.token!);

		const guildIds = InteractionHandler.commands.map(command => command.guilds).flat().filter(value => value.trim());
		const guildCommands: SlashCommand[] = [];
		for (const guildId of guildIds) {
			const commands = InteractionHandler.commands.filter(command => command.guilds.includes(guildId));
			const commandsJson = commands.map(command => command.toJSON());
			const commandsLogString = Logger.setColor('green', commands.map(command => command.name).join(', '));

			try {
				await rest.put(Routes.applicationGuildCommands(client!.user!.id, guildId), {body: commandsJson});
				guildCommands.push(...commands.values());

				commands.forEach(command => emit('registerSlashCommand', command));
				Logger.info(`Guild commands ${commandsLogString} registered for guild ${guildId}.`, 'Loading');
			} catch (error) {
				if (error instanceof DiscordAPIError) {
					if (error.code === 50001) {
						Logger.error(`Error while registering commands ${commandsLogString} for guild ${guildId} : Missing access.`,
							'Loading',
						);
						continue;
					}
					Logger.error(`Error while registering commands ${commandsLogString} for guild ${guildId} : ${error.message}`,
						'Loading',
					);
				}
			}
		}

		const globalCommands = InteractionHandler.commands.filter(command => !guildCommands.includes(command));
		const commandsJson = globalCommands.map(command => command.toJSON());
		await rest.put(Routes.applicationCommands(client!.user!.id), {body: commandsJson});

		globalCommands.forEach(command => emit('registerSlashCommand', command));
		Logger.info(`Global commands ${Logger.setColor('green', globalCommands.map(command => command.name).join(', '))} registered.`,
			'Loading',
		);

		emit('launched');
	}

	/**
	 * Add the defaults events to your InteractionHandler.
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
	 * Add the defaults commands to your InteractionHandler.
	 *
	 * @remarks
	 * Must use after {@link CommandHandler.create}.
	 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/defaults | Default Slash Commands}
	 * @param options - The options for the default commands.
	 * @returns - Itself so that afterward you can chain with other functions.
	 */
	export function useDefaultSlashCommands(options?: DefaultCommandsOptions) {
		usesDefaultCommands = true;
		defaultCommandsOptions = options;
		return InteractionHandler;
	}

	/**
	 *
	 * @param launchOptions
	 */
	export async function createInteractions(launchOptions: LaunchInteractionHandlerOptions) {
		const commandsDir = launchOptions.commandsDir;
		if (!commandsDir) throw new Error('Commands directory is not defined.');

		await loadCommands(commandsDir);

		const buildedCommands = commands
			.map(command => {
				if (command instanceof SlashCommand) return command.toJSON();
				else return null;
			})
			.filter(c => c !== null) as RESTPostAPIChatInputApplicationCommandsJSONBody[];

		Logger.log('Builded commands :', 'Loading');
		Logger.log(
			buildedCommands.map(c => c.name),
			'Loading'
		);

		const rest = new REST({version: '10'}).setToken(launchOptions.token);

		let canRegister = false;
		CommandHandler.once('launched', async () => {
			canRegister = true;
		});

		while (!canRegister) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		try {
			const guildId = launchOptions.guildId;
			if (guildId) {
				Logger.info(`Started refreshing application (/) commands for guild ${guildId}.`, 'Loading');
				await rest.put(Routes.applicationGuildCommands(CommandHandler.client?.user?.id ?? '', guildId), {body: buildedCommands});
				Logger.info(`Successfully reloaded application (/) commands for guild ${guildId}.`, 'Loading');
			} else {
				Logger.info('Started refreshing application global (/) commands.', 'Loading');
				await rest.put(Routes.applicationCommands(CommandHandler.client?.user?.id ?? ''), {body: buildedCommands});
				Logger.info('Successfully reloaded global application (/) commands.', 'Loading');
			}
		} catch (error) {
			Logger.error(`Failed to reload application (/) commands. ${error}`, 'Loading');
		}
	}
}
