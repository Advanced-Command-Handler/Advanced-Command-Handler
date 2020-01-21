const {Client, Collection} = require('discord.js');
const {owners, prefixes} = require('../informations/stocks/config.json');
const {readdirSync} = require('fs');
const {gray, grey, magenta, red, yellow} = require('chalk');

module.exports = class AdvancedClient extends Client {
	
	constructor(token, props) {
		super(props);
		super.login(token).then(() => {});
		
		prefixes.push(`<@${this.user.id}>`);
		this.prefixes = prefixes;
		
		this.commands = new Collection();
		this.owners = owners;
		console.log(grey('Client initialized'));
	}
	
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
	
	loadCommand(path, name) {
		const command = require(`.${path}/${name}`);
		if (command === undefined) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		
		this.commands.set(name, command);
		console.log(gray(`Loading the command : ${red(name)}`));
	}
	
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
	
	isOwner(id) {
		return owners.includes(id);
	}
	
	hasPermission(message, permission) {
		return message.guild === null || message.guild === undefined ? false : message.guild.me.hasPermission(permission, true, false, false);
	};
};