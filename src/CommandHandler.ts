import {type ClientOptions, Collection, type Message, type MessageEmbed, type PresenceData, type Snowflake, Team} from 'discord.js';
import {EventEmitter} from 'events';
import {promises as fsPromises} from 'fs';
import {join} from 'path';
import packageJson from '../package.json' with {type: 'json'};
import {AdvancedClient} from './classes/AdvancedClient.js';
import {type Command, Tag} from './classes/commands/Command.js';
import {CommandHandlerError} from './classes/errors/CommandHandlerError.js';
import type {Event} from './classes/Event.js';
import type {SlashCommand} from './classes/interactions/SlashCommand.js';
import {Logger} from './helpers/Logger.js';
import type {Constructor} from './types.js';
import {loadClass} from './utils/load.js';

export namespace CommandHandler {
	/**
	 * The options for the default {@link HelpCommand | help} command.
	 */
	export interface HelpOptions {
		/**
		 * Delete the help message after the delay, in seconds.
		 */
		deleteMessageAfterDelay?: number;
		/**
		 * Exclude commands to the global help menu, exclude by name or alias.
		 */
		globalMenuExcludeCommands?: string[];
		/**
		 * Use a list of commands instead of a list categories.
		 * Will only work for 25 commands max and throw an error if you use it with more commands.
		 */
		globalMenuUseList?: boolean;
	}

	/**
	 * The options for the default commands.
	 */
	interface DefaultCommandsOptions {
		/**
		 * The default commands to exclude when loading the bot.
		 */
		exclude?: string[];
		/**
		 * The options for the default {@link HelpCommand | help} command.
		 */
		helpOptions?: HelpOptions;
	}

	/**
	 * The options for the default {@link MessageCreateEvent | messageCreate} event.
	 */
	export interface MessageCreateOptions {
		/**
		 * Exclude bot or not.
		 *
		 * @defaultValue true
		 */
		excludeBots?: boolean;
		/**
		 * A list of global tags to apply before the commands is executed.
		 */
		globalTags?: Array<Tag | keyof typeof Tag>;
		/**
		 * Send the code error when a command execution is failed and an error is thrown.
		 *
		 * @defaultValue true
		 */
		sendCodeError?: boolean;
		/**
		 * Send the code error only to owners when a command execution is failed and an error is thrown.
		 *
		 * @defaultValue true
		 */
		sendCodeErrorOnlyToOwners?: boolean;
		/**
		 * A message to send to anyone (or not-owners if {@link sendCodeErrorOnlyToOwners} is set) when a command execution is failed and an error is thrown.
		 */
		sendWhenError?: MessageEmbed | string;
	}

	/**
	 * The options for the default events.
	 */
	interface DefaultEventsOptions {
		/**
		 * The default events to exclude when loading the bot.
		 */
		exclude?: string[];
		/**
		 * The options for the default {@link MessageCreateEvent | messageCreate} event.
		 */
		messageCreateOptions?: MessageCreateOptions;
	}

	/**
	 * The options for creating a new CommandHandler instance.
	 */
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
		 */
		prefixes?: string[];

		/**
		 * Save all the logs in these files.
		 *
		 * @remarks If one of the files is not found, it will create it.
		 */
		saveLogsInFiles?: string[];

		/**
		 * Add mention of the bot as prefixes.
		 *
		 * @defaultValue true
		 */
		useMentionAsPrefix?: boolean;
	}

	/**
	 * @internal
	 */
	export interface CommandCooldown {
		/**
		 * The actual cooldown of the Command.
		 */
		cooldown: number;
		/**
		 * The date the cooldown has started.
		 */
		executedAt: Date;
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
		 * Whether to add the bot owner or the team members (if bot is from a team) to the {@link owners}.
		 *
		 * @defaultValue true
		 */
		addBotAndTeamOwnersToOwners?: boolean;
		/**
		 * The client options, see {@link https://discord.js.org/#/docs/main/stable/typedef/ClientOptions | ClientOptions}.
		 */
		clientOptions: ClientOptions;
		/**
		 * If set to true, it will cycle between the {@link presences}.
		 *
		 * @defaultValue true
		 */
		cycleBetweenPresences?: boolean;
		/**
		 * The duration in seconds between the cycle of two presences of {@link presences}.
		 *
		 * @defaultValue 60
		 */
		cycleDuration?: number;
		/**
		 * The presence of your bot when launched.
		 *
		 * @remarks
		 * If {@link presences} is also set, it will overcome this property.
		 */
		presence?: PresenceData;
		/**
		 * The presences of your bot, if this field is used it will cycle between all if  {@link cycleBetweenPresences} options is set to true.
		 *
		 * @remarks
		 * If {@link presence} is also set, it will still cycle between presences.
		 */
		presences?: PresenceData[];
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
	export type CommandHandlerEvents = {
		/**
		 * The event executed when creating the CommandHandler.
		 */
		create: [CreateCommandHandlerOptions];
		/**
		 * The event executed when a CommandHandlerError is created.
		 *
		 * @remarks You need to add a listener to this event for every bots otherwise it will crash in some places with a weird error.
		 * @see {@link https://nodejs.org/api/errors.html#errors_err_unhandled_error}
		 */
		error: [CommandHandlerError];
		/**
		 * The event executed when the CommandHandler starts its launch.
		 */
		launch: [LaunchCommandHandlerOptions];
		/**
		 * The event executed when the CommandHandler has finished launching..
		 */
		launched: [];
		/**
		 * The event executed when loading a Command.
		 */
		loadCommand: [Command];
		/**
		 * The event executed when loading an Event.
		 */
		loadEvent: [Event];
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
	 * The commands registered by the CommandHandler.
	 */
	export const commands = new Collection<string, Command>();
	/**
	 * The cooldowns mapped by ID and cooldown user.
	 *
	 * <strong>A simple explication</strong> :<br>
	 * When a user executes a command with a cooldown, a new value is added.
	 * ```typescript
	 * [anyID]: {
	 *    [commandName]: {
	 *        executedAt: Date,
	 *        cooldown: [command cooldown]
	 *    }
	 * }
	 * ```
	 * So cooldowns are mapped by IDs (can be anything, user IDs recommended) then mapped by commands.
	 */
	export const cooldowns = new Collection<Snowflake, CooldownUser>();
	/**
	 * The events registered by the EventHandler.
	 *
	 * @remarks
	 * These events may not be bound to the {@link client}.
	 */
	export const events = new Collection<string, Event>();
	export let commandsDir = '';
	export let eventsDir = '';
	export let owners: string[] = [];
	export let prefixes: string[] = [];

	export let usesDefaultEvents: boolean = false;
	export let defaultEventsOptions: DefaultEventsOptions | undefined = undefined;
	export let usesDefaultCommands: boolean = false;
	export let defaultCommandsOptions: DefaultCommandsOptions | undefined = undefined;

	/**
	 * The client of the handler, null before {@link launch} function executed.
	 */
	export let client: AdvancedClient | null = null;

	/**
	 * The interval of the cycling presences, undefined if you don't use it.
	 */
	export let presencesInterval: NodeJS.Timer;

	/**
	 * @internal
	 */
	let useMentionAsPrefix: boolean;

	/**
	 * Execute the event you want from the {@link emitter | listener} throughout the CommandHandler.
	 *
	 * @typeParam K - Event names of the CommandHandler listener.
	 * @param eventName - The event name.
	 * @param args - The arguments to pass.
	 */
	export function emit<K extends keyof CommandHandlerEvents>(eventName: K, ...args: CommandHandlerEvents[K]) {
		emitter.emit(eventName, args);
	}

	/**
	 * Adds a listener for the {@link eventName} event.
	 *
	 * @typeParam K - Event names of the CommandHandler listener.
	 * @param eventName - The event name.
	 * @param fn - The callback to execute.
	 */
	export function on<K extends keyof CommandHandlerEvents>(eventName: K, fn: (...args: CommandHandlerEvents[K]) => void) {
		emitter.on(eventName, fn as (...args: any[]) => void);
	}

	/**
	 * Adds a one-time listener for the {@link eventName} event.
	 *
	 * @typeParam K - Event names of the CommandHandler listener.
	 * @param eventName - The event name.
	 * @param fn - The callback to execute.
	 */
	export function once<K extends keyof CommandHandlerEvents>(eventName: K, fn: (...args: CommandHandlerEvents[K]) => void) {
		emitter.once(eventName, fn as (...args: any[]) => void);
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
		return commands.find(c => c.nameAndAliases.includes(name));
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
		return CommandHandler;
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
		return CommandHandler;
	}

	/**
	 * Creates a new CommandHandler, wrap up the last one.
	 *
	 * @param options - Options for creating a new CommandHandler.
	 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/command-handler#creating-your-commandhandler}
	 * @returns - Itself so that afterward you can chain with other functions.
	 */
	export function create(options: CreateCommandHandlerOptions) {
		options.saveLogsInFiles?.forEach(Logger.saveInFile);
		Logger.log(`Advanced Command Handler ${version} by Ayfri.`, 'Loading', 'red');
		commandsDir = options.commandsDir;
		eventsDir = options.eventsDir;
		owners = options.owners ?? [];
		prefixes = options.prefixes ?? [];
		useMentionAsPrefix = options.useMentionAsPrefix ?? true;

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
	 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/command-handler#launching-the-commandhandler}
	 * @returns - Itself in a promise so that afterward you can chain with other functions.
	 */
	export async function launch(options: LaunchCommandHandlerOptions) {
		client = new AdvancedClient(options.token, options.clientOptions);
		emit('launch', options);

		try {
			await loadCommands(commandsDir);
			await loadEvents(eventsDir);

			Logger.comment('Loading subcommands.', 'SubCommandLoading');
			commands.forEach(c => c.registerSubCommands?.());
			Logger.comment('Binding events to client.', 'Binding');
			events.forEach(event => event.bind(client!));

			Logger.info(`${client?.eventNames().length ?? 0} events loaded & bind.`, 'Loading');
		} catch (e) {
			Logger.error((e instanceof Error ? e : new Error(String(e))).stack, 'Loading');
		}

		await client.login(options.token);
		if (options.presence && !options.presences) client.user!.setPresence(options.presence);

		if (options.presences && options.presences.length > 0) {
			const cycle = options.cycleBetweenPresences ?? true;
			if (cycle && options.presences.length > 1) {
				let index = 0;

				presencesInterval = setInterval(
					() => {
						client!.user!.setPresence(options.presences![index]);
						index++;
						if (index > options.presences!.length - 1) index = 0;
					},
					(options.cycleDuration ?? 60) * 1000
				);
			} else {
				client.user!.setPresence(options.presences[0]);
			}
		}

		if (useMentionAsPrefix) {
			prefixes.push(`<@${client?.user?.id}> `);
			prefixes.push(`<@!${client?.user?.id}> `);
		}

		if (options.addBotAndTeamOwnersToOwners !== false) {
			const appOwner = (await client.application?.fetch())?.owner;
			if (appOwner) {
				if (appOwner instanceof Team) owners.push(...appOwner.members.filter(m => m.membershipState === 'ACCEPTED').map(m => m.id));
				else owners.push(appOwner.id);
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
	export function getPrefixFromMessage(message: Message) {
		return prefixes.find(prefix => message.content.startsWith(prefix));
	}

	/**
	 * Load a command from the directory & filename.
	 *
	 * @param path - The path of the command folder.
	 * @param name - The name of the command including the extension.
	 * @returns - The command itself.
	 */
	export async function loadCommand(path: string, name: string) {
		const command = await loadClass<Command>(path, name);
		const instance = new (command as Constructor<Command>)();
		if (!instance) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		if (!instance.category) instance.category = path.split(/[\\/]/).pop()!;

		const invalidPermissions = instance.getInvalidPermissions();
		if (invalidPermissions.client.length > 0)
			throw new CommandHandlerError(
				`Invalid client permissions for '${instance.name}' command.\nInvalid Permissions: '${invalidPermissions.client.sort().join(',')}'`,
				'Loading'
			);
		if (invalidPermissions.user.length > 0)
			throw new CommandHandlerError(
				`Invalid user permissions for '${instance.name}' command.\nInvalid Permissions: '${invalidPermissions.user.sort().join(',')}'`,
				'Loading'
			);

		commands.set(instance.name, instance);
		emit('loadCommand', instance);
		Logger.comment(`Loading the command : ${Logger.setColor('gold', name)}`, 'Loading');

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
		Logger.info('Loading commands.', 'Loading');
		Logger.comment(`Categories : (${dirs.length})`, 'Loading');
		if (dirs.length) {
			for (const dir of dirs) {
				const commandsPath = join(path, dir);
				const files = await fsPromises.readdir(commandsPath);
				if (!files.length) continue;
				Logger.comment(`Commands in the category '${dir}' : (${files.length})`, 'Loading');

				for (const file of files) {
					await loadCommand(commandsPath, file);
				}
			}
		}
		Logger.info(`${commands.size} commands loaded.`, 'Loading');

		if (!usesDefaultCommands) return;
		const options = defaultCommandsOptions;
		const defaultCommands = await import('./defaults/commands/index.js');

		Logger.info('Loading default commands.', 'Loading');
		defaultCommands.HelpCommand.options = options?.helpOptions ?? {};

		for (const command of Object.values(defaultCommands)) {
			const instance = new command();
			if (options?.exclude?.includes(instance.name)) continue;
			commands.set(instance.name, instance);

			Logger.comment(`Default ${Logger.setColor('green', instance.name)} command loaded.`, 'Loading');
		}
		Logger.info(`Default commands loaded. (${Object.keys(defaultCommands).length})`, 'Loading');
	}

	/**
	 * Load an event from the directory and filename.
	 *
	 * @param path - The path of the event folder.
	 * @param name - The name of the event including the extension.
	 * @returns - The event itself.
	 */
	export async function loadEvent(path: string, name: string) {
		const event = await loadClass<Event>(path, name);
		const instance = new (event as Constructor<Event>)();
		if (!event) throw new Error(`Event given name or path is not valid.\nPath : ${path}\nName:${name}`);
		events.set(instance.name, instance);

		Logger.comment(`Event ${Logger.setColor('green', instance.name)} loaded : ${Logger.setColor('gold', `${name.split('.')[0]}.js`)}`, 'Loading');

		return instance;
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

		if (files.length) for (const file of files) await loadEvent(path, file);

		if (!usesDefaultEvents) return;
		const options = defaultEventsOptions;
		const defaultEvents = await import('./defaults/events/index.js');

		Logger.info('Loading default events.', 'Loading');
		defaultEvents.MessageCreateEvent.options = options?.messageCreateOptions ?? {};

		for (const event of Object.values(defaultEvents)) {
			const instance = new event();
			if (options?.exclude?.includes(instance.name)) continue;
			events.set(instance.name, instance);

			Logger.comment(`Default ${Logger.setColor('green', instance.name)} event loaded.`, 'Loading');
		}
		Logger.info(`Default events loaded. (${Object.values(defaultEvents).length})`, 'Loading');
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
		else Logger.warn(`Command '${name}' not found.`, 'UnLoading');
	}
}
