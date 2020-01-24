
const {Client, Collection} = require('discord.js');
const {owners, prefixes} = require('../informations/stocks/config.json');
const {readdirSync} = require('fs');
const {gray, grey, magenta, red, yellow} = require('chalk');

/**
 * Class representing an improved Discord Client.
 * @extends Client
 */
module.exports = class AdvancedClient extends Client {
	/**
	 * Create a new AdvancedClient, log it and add the mention of the bot on Prefixes.
	 * This also add a collection for commands, owners, and prefixes in the props.
	 * @param {String} token - Token of the bot.
	 * @param {ClientOptions?} props - Options of a normal Client.
	 */
	constructor(token, props) {
		super(props);
		super.login(token).then(() => {
		});
		
		prefixes.push(`<@${this.user.id}>`);
		this.prefixes = prefixes;
		
		this.commands = new Collection();
		this.owners = owners;
		console.log(grey('Client initialized'));
	}
	
	/**
	 * Loads commands from the folder entered as a parameter.
	 * @param {String} path - Path of the folder of the commands.
	 * @return {void}
	 */
	loadCommands(path) {
		const dirs = readdirSync(path);
		console.log(`Commands : (${magenta(dirs.length.toString())})`);
		
		for (let i in dirs) {
			const dir = dirs[i];
			const files = readdirSync(`${path}/${dir}`);
			if (dirs.length === 0) continue;
			
			for (let j in files) {
				const c = files[j];
				if ( !c.endsWith('.js')) continue;
				
				this.loadCommand(`${path}${dir}`, c);
			}
		}
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
		console.log(gray(`Loading the command : ${red(name)}`));
	}
	
	/**
	 * Load the events from the folder entered as parameter.
	 * @param {String} path - Path of the folder of the events.
	 * @return {void}
	 */
	loadEvents(path) {
		const files = readdirSync(path);
		console.log(`Events : (${magenta(files.length.toString())})`);
		for (let file in files) {
			const eventFile = files[file];
			if ( !eventFile.endsWith('.js')) continue;
			if ( !eventFile) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
			
			const event = require(`.${path}${eventFile}`);
			const eventName = eventFile.split('.')[0];
			this.on(eventName, event.bind(null, this));
			
			console.log(gray(`Event loading : ${yellow(eventName)}.`));
		}
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
	 * @param {Message} message - The message to get the client and the to tests if it is on guild.
	 * @param {Permissions} permission - The permission to test for.
	 * @return {boolean} - Returns true if the client member has the permission.
	 */
	hasPermission(message, permission) {
		return message.guild === null || message.guild === undefined ? false : message.guild.me.hasPermission(permission, true, false, false);
	};
};