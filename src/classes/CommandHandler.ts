import {ClientOptions, Collection, Message} from 'discord.js';
import {EventEmitter} from 'events';
import {promises as fsPromises} from 'fs';
import {join, sep} from 'path';
import {Logger} from '../utils/Logger';
import AdvancedClient from './AdvancedClient';
import {Command} from './Command';

export interface CommandHandlerInstance {
	commandsDir: string;
	eventsDir: string;
	owners?: string[] | null;
	prefixes?: string[] | null;
	client: AdvancedClient | null;
	commands: Collection<string, Command>;
	cooldowns: Collection<string, number>;
}

export default class CommandHandler extends EventEmitter implements CommandHandlerInstance {
	public static instance: CommandHandler;
	public static version: string = require('../../package.json').version;
	public commandsDir: string;
	public eventsDir: string;
	public owners?: string[] | null | undefined;
	public prefixes?: string[] | null | undefined;
	public client: AdvancedClient | null;
	public commands: Collection<string, Command>;
	public cooldowns: Collection<string, number>;

	private constructor(options: {commandsDir: string; eventsDir: string; owners?: string[]; prefixes?: string[]}) {
		super();
		this.commandsDir = options.commandsDir;
		this.eventsDir = options.eventsDir;
		this.owners = options.owners;
		this.prefixes = options.prefixes;
		this.client = null;
		this.cooldowns = new Collection();
		this.commands = new Collection();
	}

	public static create(options: {commandsDir: string; eventsDir: string; owners?: string[]; prefixes?: string[]}): CommandHandlerInstance {
		Logger.log('Advanced Command Handler, by Ayfri.', 'Loading', 'red');
		if (!CommandHandler.instance) CommandHandler.instance = new CommandHandler(options);

		process.on('warning', error => Logger.error(`An error occurred. \n${error.stack}`));
		process.on('uncaughtException', error => Logger.error(`An error occurred. \n${error.stack}`));
		CommandHandler.instance.emit('create');
		return CommandHandler.instance;
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
		CommandHandler.instance.emit('launch');

		try {
			await CommandHandler.loadCommands(CommandHandler.instance.commandsDir ?? '');
			await CommandHandler.loadEvents(CommandHandler.instance.eventsDir ?? '');
		} catch (e) {
			Logger.error(e.stack, 'Loading');
		}

		await CommandHandler.instance.client.login(options.token);
		CommandHandler.instance.prefixes?.push(`<@${CommandHandler.instance.client?.user?.id}>`);
		CommandHandler.instance.owners?.push((await CommandHandler.instance.client.fetchApplication()).owner?.id ?? '');
		CommandHandler.instance.emit('launched');
		return CommandHandler.instance;
	}

	public static async loadCommand(path: string, name: string) {
		let command = await import(join(process.cwd(), `./${path}/${name}`));
		if (command.default) command = command.default;
		if (!command) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		if (command.category === 'None') command.category = path.split(/[\\/]/).pop();
		CommandHandler.instance.commands.set(name, command);
		Logger.comment(`Loading the command : ${Logger.setColor('gold', name)}`, 'loading');
	}

	public static async loadCommands(path: string) {
		if (!path) return;
		const dirs = await fsPromises.readdir(path);
		Logger.info('Loading commands.', 'loading');
		CommandHandler.instance.emit('loadCommands');
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
		CommandHandler.instance.emit('loadEvents');
		Logger.comment(`Events : (${files.length})`, 'loading');

		if (files) {
			for (const file of files) {
				let event = await import(join(process.cwd(), `${path}/${file}`));
				if (event.default && Object.keys(event).length === 1) event = event.default;
				if (!event) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${file}`);

				const eventName = file.split('.')[0];
				CommandHandler.instance.client?.on(eventName, event.bind(null, CommandHandler.instance));
				Logger.comment(`Event loading : ${Logger.setColor('gold', `${eventName}.js`)}`, 'loading');
			}
		}

		Logger.info(`${CommandHandler.instance.client?.eventNames().length ?? 0} events loaded.`, 'loading');
	}
}
