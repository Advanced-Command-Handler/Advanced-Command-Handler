const {Client} = require('discord.js');
const Logger = require('../utils/Logger.js');

/**
 * Class representing an improved Discord Client.
 * @extends {Client}
 */
module.exports = class AdvancedClient extends Client {
	#token;
	handler;
	
	/**
	 * Create a new AdvancedClient, log it and add the mention of the bot on Prefixes.
	 * This also add a collection for commands, owners, and prefixes in the props.
	 * @param {CommandHandler} handler - Represents your command handler.
	 * @param {String} token - Token of the bot.
	 * @param {ClientOptions} props - Options of a normal Client.
	 */
	constructor(handler, token, props) {
		super(props);
		this.handler = handler;
		this.#token = token;
		Logger.comment('Client initialized.', 'loading');
	};
	
	/**
	 * Tells you if the client member on the guild has the permission.
	 * @param {Object} message - The message to get the client and the to tests if it is on guild.
	 * @param {PermissionResolvable} permission - The permission to test for.
	 * @return {boolean} - Returns true if the client member has the permission.
	 */
	hasPermission(message, permission) {
		return message.guild ? false : message.guild.me.hasPermission(permission, {
			checkOwner: false,
			checkAdmin: false,
		});
	}
	
	/**
	 * Tells you if the user is an owner of the bot.
	 * @param {String} id - Id of an Discord User.
	 * @return {boolean} - Returns true if the user is in the list of owners.
	 */
	isOwner(id) {
		return this.handler.owners.includes(id);
	}
};
