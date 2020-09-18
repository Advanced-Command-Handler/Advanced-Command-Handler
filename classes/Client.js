const {Client} = require('discord.js');
const Logger = require('../utils/Logger.js');

/**
 * Class representing an improved Discord Client.
 */
module.exports = class AdvancedClient extends Client {
	#token;
	handler;

	/**
	 * Create a new AdvancedClient, log it and add the mention of the bot on Prefixes.
	 * This also add a collection for commands, owners, and prefixes in the props.
	 * @param {CommandHandler} handler - Represents your command handler.
	 * @param {string} token - Token of the bot.
	 * @param {ClientOptions?} [props] - Options of a normal Client.
	 */
	constructor(handler, token, props) {
		super(props);
		this.handler = handler;
		this.#token = token;
		Logger.comment('Client initialized.', 'loading');
	}

	/**
	 * Tells you if the client member on the guild has the permission.
	 * @param {object} message - The message to get the client to tests if it is on a guild and to get permissions of the bot.
	 * @param {PermissionResolvable} permission - The permission to test for.
	 * @returns {boolean} - Returns true if the client member has the permission.
	 */
	hasPermission(message, permission) {
		return message.guild
			? message.guild.me.hasPermission(permission, {
					checkOwner: false,
					checkAdmin: false,
			  })
			: false;
	}

	/**
	 * Tells you if the user is an owner of the bot.
	 * @param {string} id - ID of a Discord User.
	 * @returns {boolean} - Returns true if the user is in the list of owners.
	 */
	isOwner(id) {
		return this.handler.owners.includes(id);
	}
};
