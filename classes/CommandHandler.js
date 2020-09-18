const Command = require('./Command.js');
const CommandHandlerError = require('./CommandHandlerError.js');
const {Collection} = require('discord.js');
const {readdirSync, readFileSync} = require('fs');
const Client = require('./Client.js');
const Logger = require('../utils/Logger.js');
const {join} = require('path');

module.exports = class CommandHandler {
	/**
	 * @typedef {object} CommandHandlerInstance
	 * @description Represents an instance of the command handler.
	 * @property {string} commandsDir - Directory name where the commands are.
	 * @property {string} eventsDir - Directory name where the events are.
	 * @property {string[]} owners - An array of ids that are the owners (privileged persons).
	 * @property {string[]} prefixes - An array of strings that are the prefixes of your bot.
	 * @property {Client} client - The Custom Discord.js Client {@see Client}.
	 * @property {module:"discord.js".Collection<string, Command>} commands - The collection of the commands.
	 * @property {module:"discord.js".Collection<string, number>} cooldowns - The collection of the cooldowns.
	 */

	/**
	 * Represents the instance of the CommandHandler.
	 * @type {CommandHandlerInstance}
	 */
	static instance;

	/**
	 * @private
	 * @returns {CommandHandlerError} - This returns an error because a singleton cannot be instantiated.
	 */
	constructor() {
		throw new CommandHandlerError('CommandHandler is not a class that can be instantiated.');
	}

	/**
	 * @returns {string[] | null} - Returns the owners or null (when no instance exists).
	 */
	static get owners() {
		return CommandHandler.instance ? CommandHandler.instance.owners : null;
	}

	/**
	 * @param {string[]} owners - Sets owners of the bot, this can be util on some commandes.
	 * @returns {void}
	 */
	static set owners(owners) {
		CommandHandler.instance.owners = owners;
	}

	/**
	 * @returns {string[] | null} - Returns the prefixes or null (when no instance exists).
	 */
	static get prefixes() {
		return CommandHandler.instance ? CommandHandler.instance.prefixes : null;
	}

	/**
	 * @param {string[]} prefixes - Sets the prefixes for the handler.
	 * @returns {void}
	 */
	static set prefixes(prefixes) {
		CommandHandler.instance.prefixes = prefixes;
	}

	/**
	 * @returns {AdvancedClient | null} - Returns the client or null (when no instance exists)..
	 */
	static get client() {
		return CommandHandler.instance ? CommandHandler.instance.client : null;
	}

	/**
	 * @param {AdvancedClient} client - Sets the client.
	 * @returns {void}
	 */
	static set client(client) {
		CommandHandler.instance.client = client;
	}

	/**
	 * @returns {module:"discord.js".Collection<string, Command>} - Returns the commands or a new Collection (when no instance exists).
	 */
	static get commands() {
		return CommandHandler.instance ? CommandHandler.instance.commands : new Collection();
	}

	/**
	 * @param {module:"discord.js".Collection<string, Command>} commands - Sets the commands.
	 * @returns {void}
	 */
	static set commands(commands) {
		CommandHandler.instance.commands = commands;
	}

	/**
	 *
	 * @returns {module:"discord.js".Collection<string, number>} - Returns the cooldowns or a new Collection (when no instance exists).
	 */
	static get cooldowns() {
		return CommandHandler.instance ? CommandHandler.instance.cooldowns : new Collection();
	}

	/**
	 * Creates your Commannd Handler, it cans only be created one time.
	 * @param {string} commandsDir - Directory name where the commands are.
	 * @param {string} eventsDir - Directory name where the events are.
	 * @param {string[]} [owners] - An array of ids that are the owners (privileged persons).
	 * @param {string[]} [prefixes] - An array of strings that will be the prefixes of your bot, if you want to add if you want to make the mention of the bot one of the
	 * prefixes, put in the array "mention".
	 * @returns {void}
	 */
	static create({commandsDir, eventsDir, owners = [], prefixes = ['!']}) {
		console.log(Logger.setColor('magenta') + readFileSync(join(__dirname, '../assets/presentation.txt')).toString('utf8'));
		if (!CommandHandler.instance) {
			CommandHandler.instance = {
				commandsDir,
				eventsDir,
				prefixes,
				owners,
				client: null,
				commands: new Collection(),
				cooldowns: new Collection(),
			};
		}

		process.on('warning', error => {
			Logger.error(`An error occurred. \nError : ${error.stack}`);
		});
		process.on('uncaughtException', error => {
			Logger.error(`An error occurred. \nError : ${error.stack}`);
		});
	}

	/**
	 * Creates the client and start it.
	 * @param {string} token - Token of the client.
	 * @param {ClientOptions} clientOptions - Options of the client.
	 * @returns {void}
	 */
	static launch({token, clientOptions = {}}) {
		CommandHandler.client = new Client(CommandHandler, token, clientOptions);
		CommandHandler.loadCommands(CommandHandler.instance.commandsDir);
		CommandHandler.loadEvents(CommandHandler.instance.eventsDir);

		CommandHandler.client
			.login(token)
			.then(() => {
				CommandHandler.prefixes.push(`<@${CommandHandler.client.user.id}>`);
				CommandHandler.client
					.fetchApplication()
					.then(application => {
						CommandHandler.owners.push(application.owner.id);
					})
					.catch(err => Logger.error(err));
			})
			.catch(err => Logger.error(err));
	}

	/**
	 * Load the command from the folder.
	 * @param {string} path - Path of the folder of the command.
	 * @param {string} name - Given Name of the command.
	 * @returns {void}
	 */
	static loadCommand(path, name) {
		const command = require(join(process.cwd(), `./${path}/${name}`));
		if (!command) {
			throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		}

		CommandHandler.instance.commands.set(name, command);
		Logger.comment(`Loading the command : ${Logger.setColor('gold', name)}`, 'loading');
	}

	/**
	 * Load the commands from the path by fetching them and loading them individualy.
	 * @param {string} path - The path of the folder of the commands.
	 * @returns {void}
	 */
	static loadCommands(path) {
		const dirs = readdirSync(path);
		Logger.info('Loading commands.', 'loading');
		Logger.comment(`Categories : (${dirs.length})`, 'loading');

		for (const dir of dirs) {
			const files = readdirSync(join(process.cwd(), `${path}/${dir}`));
			if (dirs.length === 0) continue;

			Logger.comment(`Commands in the category '${dir}' : (${files.length})`, 'loading');

			for (const file of files) {
				CommandHandler.loadCommand(`${path}/${dir}`, file);
			}
		}

		Logger.info(`${CommandHandler.instance.commands.size} commands loaded.`, 'loading');
	}

	/**
	 * Load the events form the path by fetching them and loading them individualy.
	 * @param {string} path - Path of the folder of the events.
	 * @returns {void}
	 */
	static loadEvents(path) {
		const files = readdirSync(path);
		Logger.info('Loading events.', 'loading');
		Logger.comment(`Events : (${files.length})`, 'loading');

		for (const file of files) {
			if (!file) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);

			const event = require(join(process.cwd(), `${path}/${file}`));
			const eventName = file.split('.')[0];
			CommandHandler.client.on(eventName, event.bind(null, CommandHandler));
			Logger.comment(`Event loading : ${Logger.setColor('gold', `${eventName}.js`)}`, 'loading');
		}

		Logger.info(`${CommandHandler.client._eventsCount} events loaded.`, 'loading');
	}
};
