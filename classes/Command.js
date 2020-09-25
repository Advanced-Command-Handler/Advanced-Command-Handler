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
	cooldown;

	/**
	 * @typedef {object} CommandOptions
	 * @property {string} name
	 * @property {string} [description]
	 * @property {string} [usage]
	 * @property {string} [category]
	 * @property {string[]} [aliases]
	 * @property {module:"discord.js".PermissionString[]} [clientPermissions]
	 * @property {module:"discord.js".PermissionString[]} [userPermissions]
	 * @property {boolean} [guildOnly]
	 * @property {boolean} [ownerOnly]
	 * @property {boolean} [nsfw]
	 * @property {number} [cooldown]
	 */

	/**
	 * @function runFunction
	 * @param {CommandHandler} [handler]
	 * @param {module:"discord.js".Message} [message]
	 * @param {string[]} [args]
	 */
	/**
	 * Create a new Command.
	 * @param {CommandOptions} options - Options of the command.
	 * Only `name` is required.
	 * @param {runFunction} runFunction - Function that is executed when we do the command.
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
		this.cooldown = options.cooldown ? options.cooldown : 0;
	}

	/**
	 * Tries to delete the message without sending an Error.
	 * @param {module:"discord.js".Message} message - The message to delete.
	 * @returns {Promise<module:"discord.js".Message | undefined>} - The deleted message (or not).
	 */
	async deleteMessage(message) {
		const {client} = require('./CommandHandler.js');

		if (client.hasPermission('MANAGE_MESSAGES')) {
			return await message.delete();
		}
	}
};
