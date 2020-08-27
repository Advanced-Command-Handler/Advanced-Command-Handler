module.exports = class Command {
	name;
	run;
	description;
	usage;
	category;
	aliases;
	clientPermissions;
	userPermissions;
	guildOnly;
	ownerOnly;
	nsfw;
	
	
	/**
	 * Create a new Command.
	 * @param {{name: string, description: string, usage: string, category: string, aliases: string[], clientPermissions: Permissions[], userPermissions: Permissions[], guildOnly: boolean, ownerOnly: boolean, nsfw: boolean}} options - Options of the command.
	 * Only `name` is required.
	 * @param {Function} runFunction - Function that is executed when we do the command.
	 */
	constructor(options, runFunction) {
		this.name = options.name;
		this.run = runFunction;
		this.description = options.description ? options.description : '';
		this.usage = options.usage ? options.usage : '';
		this.category = options.category ? options.category : 'None';
		this.aliases = options.aliases ? options.aliases : [];
		this.clientPermissions = options.clientPermissions ? options.clientPermissions : ['SEND_MESSAGES'];
		this.userPermissions = options.userPermissions ? options.userPermissions : ['SEND_MESSAGES'];
		this.guildOnly = options.guildOnly ? options.guildOnly : false;
		this.ownerOnly = options.ownerOnly ? options.ownerOnly : false;
		this.nsfw = options.nsfw ? options.nsfw : false;
	}
	
	/**
	 * Tries to delete the message without sending an Exception.
	 * @param {module:"discord.js".Message} message - The message to delete.
	 * @returns {module:"discord.js".Message} - The deleted message (or not).
	 */
	async deleteMessage(message) {
		const {client} = require('./CommandHandler.js');
		
		if (client.hasPermission('MANAGE_MESSAGES')) {
			return await message.delete();
		}
	}
};
