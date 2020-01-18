const {Client, Collection} = require('discord.js');
const {owners, prefixes} = require('../informations/stocks/config.json');
const {readdirSync} = require('fs');
const {gray, grey, magenta, red, yellow} = require('chalk');

module.exports = class AdvancedClient extends Client {
	
	constructor(token, props) {
		super(props);
		super.login(token).then(() => {
			prefixes.push(`<@${this.user.id}>`);
			this.prefixes = prefixes;
		});
		
		this.commands = new Collection();
		this.events = new Collection();
		
		this.owners = owners;
		console.log(grey('Client initialized'));
	}
	
	loadCommands(path) {
		const dirs = readdirSync(path);
		console.log(`Commands : (${magenta(dirs.length)})`);
		
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
		if ( !`${path}/${name}`.endsWith('.js')) throw new Error(`Commands are only \`js\` files, path entry : ${path} : ${name}.`);
		const c = require(`.${path}/${name}`);
		if (c === undefined) throw new Error(`Command given name or path is not valid.\nPath : ${path}\nName:${name}`);
		
		this.commands.set(name, c);
		console.log(gray(`Loading the command : ${red(name)}`));
	}
	
	loadEvents(path) {
		const files = readdirSync(path);
		console.log(`Events : (${magenta(files.length)})`);
		for (let i in files) {
			const c = files[i];
			if ( !c.endsWith('.js')) return;
			
			const event = require(`.${path}${c}`);
			const eventName = c.split('.')[0];
			this.on(eventName, event.bind(null, this));
			
			this.events.set(eventName, event);
			console.log(gray(`Event loading : ${yellow(eventName)}.`));
		}
	}
};