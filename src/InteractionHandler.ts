import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {type ClientOptions, Collection, DiscordAPIError} from 'discord.js';
import {EventEmitter} from 'events';
import {promises as fsPromises} from 'fs';
import {join} from 'path';
import packageJson from '../package.json' with {type: 'json'};
import {AdvancedClient} from './classes/AdvancedClient.js';
import type {CommandHandlerError} from './classes/errors/CommandHandlerError.js';
import type {Event} from './classes/Event.js';
import type {ApplicationCommand} from './classes/interactions/ApplicationCommand.js';
import {type ApplicationCommandType, ApplicationCommandTypes} from './classes/interactions/ApplicationCommandTypes.js';
import {MessageCommand} from './classes/interactions/MessageCommand.js';
import {SlashCommand} from './classes/interactions/SlashCommand.js';
import {UserCommand} from './classes/interactions/UserCommand.js';
import {CommandHandler} from './CommandHandler.js';
import {Logger} from './helpers/Logger.js';
import type {Constructor} from './types.js';
import {loadCategoriesFiles, loadClass} from './utils/load.js';

export namespace InteractionHandler {
	/**
	 * The options for the InteractionHandler.
	 */
	interface InteractionHandlerOptions {
		/**
		 * The directory where the message commands are located.
		 */
		messageCommandsDir?: string;
		/**
		 * The directory where the slash commands are located.
		 */
		slashCommandsDir?: string;
		/**
		 * The directory where the user commands are located.
		 */
		userCommandsDir?: string;
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
		 * The client options, see {@link https://discord.js.org/#/docs/main/stable/typedef/ClientOptions | ClientOptions}.
		 */
		clientOptions?: ClientOptions;
		/**
		 * The global guild ID to launch the InteractionHandler.
		 */
		guildId?: string;
		/**
		 * The token of your bot, will use {@link CommandHandler.client} if you launch it before launching the interaction handler.
		 */
		token?: string;
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
		 * The event executed when the Interaction Handler is starting its launch.
		 */
		launching: [LaunchInteractionHandlerOptions];
		/**
		 * The event executed when the Interaction Handler is launched.
		 */
		launched: [];
		/**
		 * The event executed when loading an ApplicationCommand.
		 */
		loadApplicationCommand: [ApplicationCommand];
		/**
		 * The event executed when loading a MessageCommand.
		 */
		loadMessageCommand: [MessageCommand];
		/**
		 * The event executed when loading a SlashCommand.
		 */
		loadSlashCommand: [SlashCommand<any>];
		/**
		 * The event executed when loading a UserCommand.
		 */
		loadUserCommand: [UserCommand];
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
	export let messageCommandsDir: string | undefined = undefined;
	export let slashCommandsDir: string | undefined = undefined;
	export let userCommandsDir: string | undefined = undefined;
	export const rest = new REST({version: '9'});

	export let usesDefaultEvents = true;
	export let defaultEventsOptions: DefaultEventsOptions | undefined = undefined;
	export let usesDefaultCommands = true;
	export let defaultCommandsOptions: DefaultCommandsOptions | undefined = undefined;
	/**
	 * The commands registered by the CommandHandler.
	 */
	export const commands = new Array<ApplicationCommand>();
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
		messageCommandsDir = options.messageCommandsDir;
		slashCommandsDir = options.slashCommandsDir;
		userCommandsDir = options.userCommandsDir;
		return InteractionHandler;
	}

	/**
	 * Load a command from the directory & filename.
	 *
	 * @param path - The path of the command folder.
	 * @param name - The name of the command including the extension.
	 * @returns - The command itself.
	 */
	export async function loadApplicationCommand(path: string, name: string) {
		const command = await loadClass<ApplicationCommand>(path, name);
		const instance = new (command as Constructor<ApplicationCommand>)();
		if (!instance) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);

		commands.push(instance);

		emit('loadApplicationCommand', instance);
		if (instance instanceof SlashCommand) emit('loadSlashCommand', instance);
		else if (instance instanceof MessageCommand) emit('loadMessageCommand', instance);
		else if (instance instanceof UserCommand) emit('loadUserCommand', instance);

		return instance;
	}

	/**
	 * Load all the commands of all the categories of a specific type from a directory.
	 *
	 * @param userPath - The path of the directory to load the commands from defined by the user.
	 * @param type - The type of the commands.
	 */
	export async function loadCommandsType(userPath: string, type: ApplicationCommandType) {
		const categories = await fsPromises.readdir(userPath);
		if (!categories.length) return;
		Logger.info(`Loading ${type.logNamePlural}.`, 'Loading');
		Logger.comment(`Categories : (${categories.length})`, 'Loading');

		const categoriesFiles = await loadCategoriesFiles(userPath);
		for (const [category, command] of categoriesFiles) {
			Logger.comment(`Loading the ${type.logName} : ${Logger.setColor('gold', `${category}/${command}`)}`, 'Loading');
			const files = await fsPromises.readdir(join(userPath, category));
			if (!files.length) continue;

			for (const file of files) {
				await loadApplicationCommand(join(userPath, category), file);
			}
		}
		Logger.info(`${commands.length} ${type.logNamePlural} loaded.`, 'Loading');
	}

	/**
	 * Load all the default commands of a specific type.
	 *
	 * @param type - The type of the commands.
	 */
	export async function loadDefaultCommandsOfType(type: ApplicationCommandType) {
		const options = defaultCommandsOptions;
		let defaultCommands: Record<string, Constructor<ApplicationCommand>>;
		try {
			defaultCommands = await import(`./defaults/${type.path}/index.js`);
			console.log('defaultCommands', defaultCommands);
		} catch (error) {
			if (!(error instanceof Error)) throw new Error('An error occurred while loading the default commands.');
			if (!('code' in error)) throw error;
			if (error.code === 'ERR_MODULE_NOT_FOUND') {
				Logger.comment(`No default ${type.logName} found.`, 'Loading');
				return;
			}
			throw error;
		}

		Logger.info(`Loading default ${type.logNamePlural}.`, 'Loading');
		Logger.comment(`Default ${type.logName} : (${Object.keys(defaultCommands).length})`, 'Loading');

		for (const command of Object.values(defaultCommands)) {
			const instance = new command();
			if (options?.exclude?.includes(instance.name)) continue;
			commands.push(instance);

			Logger.comment(`Default ${Logger.setColor('green', instance.name)} command loaded.`, 'Loading');
		}
		Logger.info(`Default ${type.logNamePlural} loaded. (${Object.keys(defaultCommands).length})`, 'Loading');
	}

	/**
	 * Load all the commands types of a directory.
	 *
	 * @remarks
	 * The path must be a directory containing sub-directories.
	 * @param userPath - The path of the directory to load the commands from defined by the user.
	 * @param type - The type of the commands.
	 */
	export async function loadApplicationCommands(userPath: string, type: ApplicationCommandType) {
		await loadCommandsType(userPath, type);

		Logger.info(`${commands.length} commands loaded.`, 'Loading');

		if (!usesDefaultCommands) return;
		await loadDefaultCommandsOfType(type);
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
	 * Creates and registers the interactions.
	 *
	 * @param launchOptions - The options to launch the interactions.
	 */
	export async function createInteractions(launchOptions: LaunchInteractionHandlerOptions = {}) {
		emit('launching', launchOptions);

		console.log('slashCommandsDir', slashCommandsDir);
		console.log('usesDefaultCommands', usesDefaultCommands);

		if (messageCommandsDir) await loadApplicationCommands(messageCommandsDir, ApplicationCommandTypes.MESSAGE);
		if (slashCommandsDir) await loadApplicationCommands(slashCommandsDir, ApplicationCommandTypes.SLASH);
		if (userCommandsDir) await loadApplicationCommands(userCommandsDir, ApplicationCommandTypes.USER);

		Logger.log('Loading sub slash commands.', 'SubSlashCommandLoading');
		commands.filter(c => c instanceof SlashCommand).forEach(c => c.registerSubCommands?.());

		if (CommandHandler.commands.size) {
			CommandHandler.once('launched', () => client = CommandHandler.client);

			while (!client) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
		} else {
			if (!launchOptions.token) throw new Error('You need to provide a token to launch the interaction handler.');
			client = new AdvancedClient(launchOptions.token, launchOptions.clientOptions!);
		}

		rest.setToken(client.token!);
		try {
			const guildIds = InteractionHandler.commands
				.map(command => command.guilds)
				.flat()
				.filter(value => value.trim());
			const guildCommands: ApplicationCommand[] = [];
			for (const guildId of guildIds) {
				const commands = InteractionHandler.commands.filter(command => command.guilds.includes(guildId));
				console.log('commands', commands);

				const commandsJson = commands.map(command => command.toJSON());
				const commandsLogString = Logger.setColor('green', commands.map(command => command.name).join(', '));

				try {
					await rest.put(Routes.applicationGuildCommands(client.user!.id, guildId), {body: commandsJson});
					guildCommands.push(...commands.values());

					commands.forEach(command => emit('loadApplicationCommand', command));
					Logger.info(`Guild commands ${commandsLogString} registered for guild ${guildId}.`, 'Loading');
				} catch (error) {
					if (error instanceof DiscordAPIError) {
						if (error.code === 50001) {
							Logger.error(
								`Error while registering application (/) commands ${commandsLogString} for guild ${guildId} : Missing access.`,
								'Loading'
							);
							continue;
						}
						Logger.error(
							`Error while registering application (/) commands ${commandsLogString} for guild ${guildId} : ${error.message}`,
							'Loading'
						);
					}
				}
			}


			const globalCommands = InteractionHandler.commands.filter(command => !guildCommands.includes(command));
			console.log('globalCommands', globalCommands);
			const commandsJson = globalCommands.map(command => command.toJSON());
			const guildId = launchOptions.guildId;
			const commandsLogString = Logger.setColor('green', globalCommands.map(command => command.name).join(', '));

			if (guildId) {
				Logger.info(`Started refreshing application (/) commands for guild ${guildId}.`, 'Loading');
				await rest.put(Routes.applicationGuildCommands(client.user!.id, guildId), {body: commandsJson});
				Logger.info(`Successfully reloaded application (/) commands ${commandsLogString} for guild ${guildId}.`, 'Loading');
			} else {
				Logger.info('Started refreshing application global (/) commands.', 'Loading');
				await rest.put(Routes.applicationCommands(client.user!.id), {body: commandsJson});
				Logger.info(`Successfully reloaded global application (/) ${commandsLogString} commands.`, 'Loading');
			}
		} catch (error) {
			if (error instanceof Error) Logger.error(`Failed to reload application (/) commands. ${error.message}`, 'Loading');
			else Logger.error(`Failed to reload application (/) commands. ${String(error)}`, 'Loading');
		}

		emit('launched');
	}
}
