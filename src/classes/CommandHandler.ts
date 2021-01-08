import {ClientOptions, Collection, Message} from 'discord.js';
import {EventEmitter} from 'events';
import {promises as fsPromises} from 'fs';
import {join} from 'path';
import * as defaultCommands from '../defaults/commands';
import * as defaultEvents from '../defaults/events';
import {Logger} from '../utils/Logger';
import AdvancedClient from './AdvancedClient';
import {Command} from './Command';
import CommandHandlerError from './CommandHandlerError';
import Event from './Event';

namespace CommandHandler {
	export interface CreateCommandHandlerOptions {
		commandsDir: string;
		eventsDir: string;
		owners?: string[];
		prefixes?: string[];
	}

	type CommandHandlerEvents = {
		create: [CreateCommandHandlerOptions];
		error: [CommandHandlerError];
		launch: [];
		loadCommand: [Command];
		loadEvent: [Event];
		launched: [];
	};

	export const version: string = require('../../package.json').version;
	export const emitter: EventEmitter = new EventEmitter();
	export const commands: Collection<string, Command> = new Collection();
	export const cooldowns: Collection<string, number> = new Collection();
	export const events: Collection<string, Event> = new Collection();
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

	export function setDefaultEvents(): typeof CommandHandler {
		Logger.info('Loading default events.', 'loading');
		for (let event of Object.values(defaultEvents)) {
			events.set(event.default.name, event.default);
			Logger.comment(`Default ${Logger.setColor('green', event.default.name) + Logger.setColor('comment', ' event loaded.')}`, 'loading');
		}
		Logger.info(`Default events loaded. (${Object.values(defaultEvents).length})`, 'loading');

		return CommandHandler;
	}

	export function setDefaultCommands(): typeof CommandHandler {
		Logger.info('Loading default commands.', 'Loading');
		for (let command of Object.values(defaultCommands)) {
			commands.set(command.default.name, command.default);
			Logger.comment(`Default ${Logger.setColor('green', command.default.name) + Logger.setColor('comment', ' command loaded.')}`, 'loading');
		}
		Logger.info(`Default commands loaded. (${Object.keys(defaultCommands)})`, 'loading');

		return CommandHandler;
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

			Logger.comment('Binding events to client.', 'binding');
			events.forEach(event => {
				event.bind(client!!);
			});

			Logger.info(`${client?.eventNames().length ?? 0} events loaded & bind.`, 'loading');
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

	export function getPrefixFromMessage(message: Message): string | null {
		return prefixes.find(prefix => message.content.startsWith(prefix)) ?? null;
	}

	export async function loadCommand(path: string, name: string) {
		let command: Command | (Command & {default: Command}) = await import(join(process.cwd(), `./${path}/${name}`));
		if ('default' in command) command = command.default;
		if (!command) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		if (command.category === 'None') command.category = <string>path.split(/[\\/]/).pop();

		const invalidPermissions = command.getInvalidPermissions();
		if (invalidPermissions.client)
			throw new CommandHandlerError(`Invalid client permissions for ${command.name} command.\nInvalid Permissions: ${invalidPermissions.client.sort().join(',')}`, 'LoadingCommands');
		if (invalidPermissions.user)
			throw new CommandHandlerError(`Invalid user permissions for ${command.name} command.\nInvalid Permissions: ${invalidPermissions.user.sort().join(',')}`, 'LoadingCommands');

		commands.set(command.name, command);
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
				if ('default' in event) event = event.default;
				if (!event) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${file}`);
				events.set(event.name, event);

				Logger.comment(`Event ${event.name} loading : ${Logger.setColor('gold', `${file.split('.')[0]}.js`)}`, 'loading');
			}
		}
	}

	export function loadEvent(event: Event | (Event & {default: Event})): Event {
		if ('default' in event) event = event.default;

		if (event.once) client?.once(event.name, event.run.bind(null, CommandHandler));
		else client?.on(event.name, event.run.bind(null, CommandHandler));
		emit('loadEvent', event);

		return event;
	}
}

export default CommandHandler;
