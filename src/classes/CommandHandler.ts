import {ClientOptions, Collection, Message} from 'discord.js';
import {promises as fsPromises} from 'fs';
import {join} from 'path';
import AdvancedClient from './AdvancedClient';
import {Command} from './Command';
import CommandHandlerError from './CommandHandlerError';
import Event from './Event';
import {EventEmitter} from 'events';
import {Logger} from '../utils/Logger';

namespace CommandHandler {
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

	export const version: string = require('../../package.json').version;
	export const emitter: EventEmitter = new EventEmitter();
	export const commands: Collection<string, Command> = new Collection();
	export const cooldowns: Collection<string, number> = new Collection();
	export let commandsDir: string = '';
	export let eventsDir: string = '';
	export let owners: string[] = [];
	export let prefixes: string[] = [];
	export let client: AdvancedClient | null = null;

	export function on<K extends keyof CommandHandlerEvents>(eventName: K, fn: (listener: CommandHandlerEvents[K]) => void): void {
		emitter.on(eventName, fn);
	}

	export function emit<K extends keyof CommandHandlerEvents>(eventName: K, ...args: CommandHandlerEvents[K]) {
		emitter.emit(eventName, args);
	}

	export function create(options: CreateCommandHandlerOptions): typeof CommandHandler {
		Logger.log(`Advanced Command Handler ${version} by Ayfri.`, 'Loading', 'red');
		commandsDir = options.commandsDir;
		eventsDir = options.eventsDir;
		owners = options.owners ?? [];
		prefixes = options.prefixes ?? [];

		process.on('warning', error => Logger.error(`An error occurred. \n${error.stack}`));
		process.on('uncaughtException', error => Logger.error(`An error occurred. \n${error.stack}`));
		emit('create', options);
		return CommandHandler;
	}

	export async function launch(options: {token: string; clientOptions?: ClientOptions}): Promise<typeof CommandHandler> {
		client = new AdvancedClient(options.token, options.clientOptions ?? {});
		emit('launch');

		try {
			await loadCommands(commandsDir ?? '');
			await loadEvents(eventsDir ?? '');
		} catch (e) {
			Logger.error(e.stack, 'Loading');
		}

		await client.login(options.token);
		prefixes.push(`<@${client?.user?.id}>` );
		owners.push((await client.fetchApplication()).owner?.id ?? '');
		emit('launched', CommandHandler);
		return CommandHandler;
	}

	export function getPrefixFromMessage(message: Message): string | null {
		return prefixes.find(prefix => message.content.startsWith(prefix)) ?? null;
	}

	export async function loadCommand(path: string, name: string) {
		let command = await import(join(process.cwd(), `./${path}/${name}`));
		if (command.default) command = command.default;
		if (!command) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		if (command.category === 'None') command.category = path.split(/[\\/]/).pop();
		commands.set(name, command);
		emit('loadCommand', command);
		Logger.comment(`Loading the command : ${Logger.setColor('gold', name)}`, 'loading');
	}

	export async function loadCommands(path: string) {
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
					await loadCommand(`${path}/${dir}`, file);
				}
			}
		}
		Logger.info(`${commands.size} commands loaded.`, 'loading');
	}

	export async function loadEvents(path: string) {
		if (!path) return;
		const files = await fsPromises.readdir(path);
		Logger.info('Loading events.', 'loading');
		Logger.comment(`Events : (${files.length})`, 'loading');

		if (files) {
			for (const file of files) {
				let event: Event | (Event & {default: Event}) = await import(join(process.cwd(), `${path}/${file}`));
				if ('default' in event && Object.keys(event).length === 1) event = event.default;
				if (!event) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${file}`);

				if (event.once) client?.once(event.name, event.run.bind(null, CommandHandler));
				else client?.on(event.name, event.run.bind(null, CommandHandler));

				Logger.comment(`Event loading : ${Logger.setColor('gold', `${file.split('.')[0]}.js`)}`, 'loading');
				emit('loadEvent', event);
			}
		}

		Logger.info(`${client?.eventNames().length ?? 0} events loaded.`, 'loading');
	}
}

export default CommandHandler;
