const fs = require('fs');
module.exports = class Command {
	#dirs;
	
	constructor(props, runFunction) {
		this.name = props.name;
		this.description = props.description;
		this.run = runFunction;
		if (props.hasOwnProperty('category')) this.category = props.category; else {
			this.#dirs = fs.readdirSync('./commands');
			this.#dirs.forEach(dir => {
				const category = fs.readdirSync(`./commands/${dir}`);
				if (category.includes(`${this.name}.js`)) this.category = dir;
			});
			this.#dirs = undefined;
		}
		if (props.hasOwnProperty('usage')) this.usage = props.usage;
		if (props.hasOwnProperty('clientPermissions')) this.clientPermissions = props.clientPermissions.length > 0 ? props.clientPermissions : ['SEND_MESSAGES'];
		if (props.hasOwnProperty('userPermissions')) this.userPermissions = props.userPermissions.length > 0 ? props.userPermissions : ['SEND_MESSAGES'];
		if (props.hasOwnProperty('aliases')) this.aliases = props.aliases;
		if (props.hasOwnProperty('guildOnly')) this.guildOnly = props.guildOnly;
		if (props.hasOwnProperty('ownerOnly')) this.ownerOnly = props.ownerOnly;
		if (props.hasOwnProperty('nsfwOnly')) this.nsfwOnly = props.nsfwOnly;

		if(this.category === 'administration') this.userPermissions = ['ADMINISTRATOR'];
	}
};
