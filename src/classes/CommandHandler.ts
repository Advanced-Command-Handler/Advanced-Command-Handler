import {ClientOptions, Collection, Message} from 'discord.js';
import {EventEmitter} from 'events';
import {promises as fsPromises} from 'fs';
import {join} from 'path';
import {Logger} from '../utils/Logger';
import AdvancedClient from './AdvancedClient';
import {Command} from './Command';
import CommandHandlerError from './CommandHandlerError';
import Event from './Event';

export interface CreateCommandHandlerOptions {
	commandsDir: string;
	eventsDir: string;
	owners?: string[];
	prefixes?: string[];
}

export interface CommandHandlerInstance extends CreateCommandHandlerOptions {
	client: AdvancedClient | null;
	commands: Collection<string, Command>;
	cooldowns: Collection<string, number>;
}

type CommandHandlerEvents = {
	create: [CreateCommandHandlerOptions];
	error: [CommandHandlerError];
	launch: [];
	loadCommand: [Command];
	loadEvent: [Event];
	launched: [CommandHandlerInstance];
};

export default class CommandHandler implements CommandHandlerInstance {
	private static emitter: EventEmitter = new EventEmitter();
	public static instance: CommandHandler;
	public static version: string = require('../../package.json').version;
	public commandsDir: string;
	public eventsDir: string;
	public owners?: string[];
	public prefixes?: string[];
	public client: AdvancedClient | null;
	public commands: Collection<string, Command>;
	public cooldowns: Collection<string, number>;

	private constructor(options: CreateCommandHandlerOptions) {
		this.commandsDir = options.commandsDir;
		this.eventsDir = options.eventsDir;
		this.owners = options.owners;
		this.prefixes = options.prefixes;
		this.client = null;
		this.cooldowns = new Collection();
		this.commands = new Collection();
	}

	public static on<K extends keyof CommandHandlerEvents>(eventName: K, fn: (listener: CommandHandlerEvents[K]) => void): void {
		CommandHandler.emitter.on(eventName, fn);
	}

	public static create(options: CreateCommandHandlerOptions): typeof CommandHandler {
		Logger.log('Advanced Command Handler, by Ayfri.', 'Loading', 'red');
		if (!CommandHandler.instance) CommandHandler.instance = new CommandHandler(options);

		process.on('warning', error => Logger.error(`An error occurred. \n${error.stack}`));
		process.on('uncaughtException', error => Logger.error(`An error occurred. \n${error.stack}`));
		CommandHandler.emit('create', options);
		return CommandHandler;
	}

	public static getPrefixFromMessage(message: Message): string | null {
		let prefix = null;
		for (const thisPrefix of CommandHandler.instance.prefixes ?? []) {
			if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;
		}

		return prefix;
	}

	public static async launch(options: {token: string; clientOptions?: ClientOptions}): Promise<CommandHandlerInstance> {
		CommandHandler.instance.client = new AdvancedClient(CommandHandler.instance, options.token, options.clientOptions ?? {});
		CommandHandler.emit('launch');

		try {
			await CommandHandler.loadCommands(CommandHandler.instance.commandsDir ?? '');
			await CommandHandler.loadEvents(CommandHandler.instance.eventsDir ?? '');
		} catch (e) {
			Logger.error(e.stack, 'Loading');
		}

		await CommandHandler.instance.client.login(options.token);
		CommandHandler.instance.prefixes?.push(`<@${CommandHandler.instance.client?.user?.id}>`);
		CommandHandler.instance.owners?.push((await CommandHandler.instance.client.fetchApplication()).owner?.id ?? '');
		CommandHandler.emit('launched', CommandHandler.instance);
		return CommandHandler.instance;
	}

	public static async loadCommand(path: string, name: string) {
		let command = await import(join(process.cwd(), `./${path}/${name}`));
		if (command.default) command = command.default;
		if (!command) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		if (command.category === 'None') command.category = path.split(/[\\/]/).pop();
		CommandHandler.instance.commands.set(name, command);
		CommandHandler.emit('loadCommand', command);
		Logger.comment(`Loading the command : ${Logger.setColor('gold', name)}`, 'loading');
	}

	public static async loadCommands(path: string) {
		if (!path) return;
		const dirs = await fsPromises.readdir(path);
		Logger.info('Loading commands.', 'loading');
		Logger.comment(`Categories : (${dirs.length})`, 'loading');
		if (dirs) {
			for (const dir of dirs) {
				const files = await fsPromises.readdir(join(process.cwd(), `${path}/${dir}`));
				if (files.length === 0) continue;
				Logger.comment(`Commands in the category '${dir}' : (${files.length})`, 'loading');

				for (const file of files) {
					await CommandHandler.loadCommand(`${path}/${dir}`, file);
				}
			}
		}
		Logger.info(`${CommandHandler.instance.commands.size} commands loaded.`, 'loading');
	}

	public static async loadEvents(path: string) {
		if (!path) return;
		const files = await fsPromises.readdir(path);
		Logger.info('Loading events.', 'loading');
		Logger.comment(`Events : (${files.length})`, 'loading');

		if (files) {
			for (const file of files) {
				let event: Event | (Event & {default: Event}) = await import(join(process.cwd(), `${path}/${file}`));
				if ('default' in event && Object.keys(event).length === 1) event = event.default;
				if (!event) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${file}`);

				const eventName = file.split('.')[0];
				CommandHandler.instance.client?.on(eventName, event.run.bind(null, CommandHandler.instance));
				Logger.comment(`Event loading : ${Logger.setColor('gold', `${eventName}.js`)}`, 'loading');
				CommandHandler.emit('loadEvent', event);
			}
		}

		Logger.info(`${CommandHandler.instance.client?.eventNames().length ?? 0} events loaded.`, 'loading');
	}

	public static emit<K extends keyof CommandHandlerEvents>(eventName: K, ...args: CommandHandlerEvents[K]) {
		CommandHandler.emitter.emit(eventName, args);
	}
}
