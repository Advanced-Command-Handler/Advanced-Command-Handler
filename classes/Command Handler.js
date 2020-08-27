const Command = require('./Command.js');
const CommandHandlerError = require('./CommandHandlerError.js');
const {Collection} = require('discord.js');
const {readdirSync, readFileSync} = require('fs');
const Client = require('./Client.js');
const Logger = require('../utils/Logger.js');

module.exports = class CommandHandler {
	/**
	 * Represents the instance of the CommandHandler.
	 * @type {{commandsDir: String, eventsDir: String, prefixes: String[], client: Client, owners: String[], commands: module:"discord.js".Collection<String, Command>}}
	 */
	static instance;
	
	constructor() {
		return new CommandHandlerError('CommandHandler is not a class who can be instantiated.');
	}
	
	static get owners() {
		return CommandHandler.instance ? CommandHandler.instance.owners : null;
	}
	
	static set owners(owners) {
		CommandHandler.instance.owners = owners;
	}
	
	static get prefixes() {
		return CommandHandler.instance ? CommandHandler.instance.prefixes : null;
	}
	
	static set prefixes(prefixes) {
		CommandHandler.instance.prefixes = prefixes;
	}
	
	static get client() {
		return CommandHandler.instance ? CommandHandler.instance.client : null;
	}
	
	static set client(client) {
		CommandHandler.instance.client = client;
	}
	
	static get commands() {
		return CommandHandler.instance ? CommandHandler.instance.commands : new Collection();
	}
	
	static set commands(commands) {
		CommandHandler.instance.commands = commands;
	}
	
	/**
	 * Creates your Commannd Handler, it cans only be created one time.
	 * @param {String[]} [owners] - An array of ids that are the owners (privileged persons).
	 * @param {String[]} [prefixes] - An array of strings that will be the prefixes of your bot, if you want to add if you want to make the mention of the bot one of the
	 * prefixes, put in the array "mention".
	 * @param {String} commandsDir
	 * @param {String} eventsDir
	 */
	static create({commandsDir, eventsDir, owners = [], prefixes = ['!']}) {
		console.log(Logger.setColor('magenta') + readFileSync(../assets/presentation.txt').toString('utf8'));
		if (!CommandHandler.instance) {
			/**
			 * @type {{commandsDir: String, prefixes: String[], eventsDir: String, client: null, owners: String[], commands: module:"discord.js".Collection<String, Command>}} CommandHandler
			 */
			CommandHandler.instance = {
				commandsDir: commandsDir,
				eventsDir:   eventsDir,
				prefixes:    prefixes,
				owners:      owners,
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
	 * @param {String} token - Token of the client.
	 * @param {ClientOptions} clientOptions - Options of the client.
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
	 * @param {String} path - Path of the folder of the command.
	 * @param {String} name - Given Name of the command.
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
	
	static loadCommands(path) {
		const dirs = readdirSync(path);
		Logger.info('Loading commands.', 'loading');
		Logger.comment(`Categories : (${dirs.length})`, 'loading');
		
		for (let i in dirs) {
			if (!dirs.hasOwnProperty(i)) return;
			
			const dir = dirs[i];
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
	 * Load the events from the folder entered as parameter.
	 * @param {String} path - Path of the folder of the events.
	 * @return {void}
	 */
	static loadEvents(path) {
		const files = readdirSync(path);
		Logger.info('Loading events.', 'loading');
		Logger.comment(`Events : (${files.length})`, 'loading');
		
		for (let file in files) {
			const eventFile = files[file];
			if (!eventFile) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
			
			const event = require(`./../../${path}/${eventFile}`);
			const eventName = eventFile.split('.')[0];
			CommandHandler.client.on(eventName, event.bind(null, CommandHandler));
			Logger.comment(`Event loading : ${Logger.setColor('gold', `${eventName}.js`)}`, 'loading');
		}
		Logger.info(`${CommandHandler.client._eventsCount} events loaded.`, 'loading');
	}
};
