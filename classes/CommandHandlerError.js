module.exports = class CommandHandlerError extends Error {
	where;

	/**
	 * @param {any} where - Place where this has occured, the name of event/command or the Command Handler itself.
	 * @param {string?} message - Default settings for an Error.
	 */
	constructor(where, message) {
		super(message);

		if (Error.captureStackTrace) Error.captureStackTrace(this, CommandHandlerError);

		this.name = 'CommandHandlerError';
		this.where = where;
		this.date = new Date();
	}
};
