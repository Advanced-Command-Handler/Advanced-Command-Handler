const Command = require('./Command.js');
const CommandHandlerError = require('./CommandHandlerError.js');
const {Collection} = require('discord.js');
const {readdirSync, readFileSync} = require('fs');
const Client = require('./Client.js');
const Logger = require('../utils/Logger.js');

module.exports = class CommandHandler {
	/**
	 * Represents the instance of the CommandHandler.
	 * @type {{commandsDir: string, eventsDir: string, prefixes: string[], client: Client, owners: string[], commands: module:"discord.js".Collection<string, Command>}}
	 */
	static instance;
	
	/**
	 * @private
	 * @returns {CommandHandlerError} - This returns an error because a singleton cannot be instantiated.
	 */
	constructor() {
		return new CommandHandlerError('CommandHandler is not a class that can be instantiated.');
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
	 * @returns {module:"discord.js".Collection<string, Command> | module:"discord.js".Collection<string Command>} - Returns the commands or a new Collection (when no instance existst).
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
	 * Creates your Commannd Handler, it cans only be created one time.
	 * @param {string} commandsDir - Directoery name where the commands are.
	 * @param {string} eventsDir - Directoery name where the events are.
	 * @param {string[]} [owners] - An array of ids that are the owners (privileged persons).
	 * @param {string[]} [prefixes] - An array of strings that will be the prefixes of your bot, if you want to add if you want to make the mention of the bot one of the
	 * prefixes, put in the array "mention".
	 * @returns {void}
	 */
	static create({commandsDir, eventsDir, owners = [], prefixes = ['!']}) {
		console.log(Logger.setColor('magenta') + readFileSync('../assets/presentation.txt').toString('utf8'));
		if (!CommandHandler.instance) {
			/**
			 * @type {{commandsDir: string, prefixes: string[], eventsDir: string, client: null, owners: string[], commands: module:"discord.js".Collection<string, Command>}} CommandHandler
			 */
			CommandHandler.instance = {
				commandsDir,
				eventsDir,
				prefixes,
				owners,
				client:      null,
				commands:    new Collection(),
			};
		}
		
		process.on('warning', (error) => {
			Logger.error(`An error occurred. \nError : ${error.stack}`);
		});
		process.on('uncaughtException', (error) => {
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
		
		CommandHandler.client.login(token).then(() => {
			CommandHandler.prefixes.push(`<@${CommandHandler.client.user.id}>`);
			CommandHandler.client.fetchApplication().then(application => {
				CommandHandler.owners.push(application.owner.id);
			}).catch((err) => Logger.error(err));
		}).catch((err) => Logger.error(err));
	}
	
	/**
	 * Load the command {given name} into the folder {path}.
	 * @param {string} path - Path of the folder of the command.
	 * @param {string} name - Given Name of the command.
	 * @return {void}
	 */
	static loadCommand(path, name) {
		const command = require(`./../../${path}/${name}`);
		if (command === undefined) {
			throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		}
		
		CommandHandler.instance.commands.set(name, command);
		Logger.comment(`Loading the command : ${Logger.setColor('gold', name)}`, 'loading');
	}
	
	/**
	 * Load the commands form the path by fetching them and load them individualy.
	 * @param {string} path
	 * @returns {void}
	 */
	static loadCommands(path) {
		const dirs = readdirSync(path);
		Logger.info('Loading commands.', 'loading');
		Logger.comment(`Categories : (${dirs.length})`, 'loading');
		
		for (const dir of dirs) {
			const files = readdirSync(`${path}/${dir}`);
			if (dirs.length === 0) continue;
			
			Logger.comment(`Commands in the category '${dir}' : (${files.length})`, 'loading');
			
			for (let command in files) {
				CommandHandler.loadCommand(`${path}/${dir}`, files[command]);
			}
		}
		
		Logger.info(`${CommandHandler.instance.commands.size} commands loaded.`, 'loading');
	}
	
	/**
	 * Load the events form the path by fetching them and load them individualy.
	 * @param {string} path - Path of the folder of the events.
	 * @return {void}
	 */
	static loadEvents(path) {
		const files = readdirSync(path);
		Logger.info('Loading events.', 'loading');
		Logger.comment(`Events : (${files.length})`, 'loading');
		
		for (const file of files) {
			if (!file) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
			
			const event = require(`./../../${path}/${file}`);
			const eventName = file.split('.')[0];
			CommandHandler.client.on(eventName, event.bind(null, CommandHandler));
			Logger.comment(`Event loading : ${Logger.setColor('gold', `${eventName}.js`)}`, 'loading');
		}
		
		Logger.info(`${CommandHandler.client._eventsCount} events loaded.`, 'loading');
	}
};
