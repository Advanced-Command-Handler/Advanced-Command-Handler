const {Client, Collection} = require('discord.js');
const {owners, prefixes} = require('../informations/config.json');
const {readdirSync} = require('fs');
const Logger = require('../utils/Logger.js');

/**
 * Class representing an improved Discord Client.
 * @extends {Client}
 */
module.exports = class AdvancedClient extends Client {
	/**
	 * Create a new AdvancedClient, log it and add the mention of the bot on Prefixes.
	 * This also add a collection for commands, owners, and prefixes in the props.
	 * @param {String} token - Token of the bot.
	 * @param {Object?} props - Options of a normal Client.
	 */
	constructor(token, props) {
		super(props);
		super.login(token).then(() => prefixes.push(`<@${this.user.id}>`));
		this.prefixes = prefixes;
		
		this.commands = new Collection();
		this.owners = owners;
		Logger.comment('Client initialized.', 'loading');
	};
	
	/**
	 * Loads commands from the folder entered as a parameter.
	 * @param {String} path - Path of the folder of the commands.
	 * @return {void}
	 */
	loadCommands(path) {
		const dirs = readdirSync(path);
		let total = 0;
		Logger.info('Loading commands.', 'loading');
		Logger.comment(`Categories : (${dirs.length})`, 'loading');
		
		for (let i in dirs) {
			const dir = dirs[i];
			const files = readdirSync(`${path}/${dir}`);
			if (dirs.length === 0) continue;
			Logger.comment(`Commands in category '${dir}' : (${files.length})`, 'loading');
			
			for (let j in files) {
				const c = files[j];
				if ( !c.endsWith('.js')) continue;
				
				this.loadCommand(`${path}${dir}`, c);
				total++;
			}
		}
		Logger.info(`${total} commands loaded.`, 'loading');
	}
	
	/**
	 * Load the command {name} into the folder {path}.
	 * @param {String} path - Path of the folder of the command.
	 * @param {String} name - Name of the command.
	 * @return {void}
	 */
	loadCommand(path, name) {
		const command = require(`.${path}/${name}`);
		if (command === undefined) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		
		this.commands.set(name, command);
		Logger.comment(`Loading the command : ${Logger.setColor('gold', name)}`, 'loading');
	}
	
	/**
	 * Load the events from the folder entered as parameter.
	 * @param {String} path - Path of the folder of the events.
	 * @return {void}
	 */
	loadEvents(path) {
		const files = readdirSync(path);
		let total = 0;
		Logger.info('Loading events.', 'loading');
		Logger.comment(`Events : (${files.length})`, 'loading');
		for (let file in files) {
			const eventFile = files[file];
			if ( !eventFile.endsWith('.js')) continue;
			if ( !eventFile) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
			
			const event = require(`.${path}${eventFile}`);
			const eventName = eventFile.split('.')[0];
			this.on(eventName, event.bind(null, this));
			total++;
			Logger.comment(`Event loading : ${Logger.setColor('gold', `${eventName}.js`)}`, 'loading');
		}
		Logger.info(`${total} events loaded.`, 'loading');
	}
	
	/**
	 * Tells you if the user is an owner of the bot.
	 * @param {String} id - Id of an Discord User.
	 * @return {boolean} - Returns true if the user is in the list of owners.
	 */
	isOwner(id) {
		return owners.includes(id);
	}
	
	/**
	 * Tells you if the client member on the guild has the permission.
	 * @param {Object} message - The message to get the client and the to tests if it is on guild.
	 * @param {Permissions} permission - The permission to test for.
	 * @return {boolean} - Returns true if the client member has the permission.
	 */
	hasPermission(message, permission) {
		return message.guild === null || message.guild === undefined ? false : message.guild.me.hasPermission(permission, true, false, false);
	}
};