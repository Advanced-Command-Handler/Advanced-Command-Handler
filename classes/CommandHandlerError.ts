export default class CommandHandlerError extends Error {
	readonly where: string;
	readonly date: Date;

	/**
	 * @param {any} where - Place where this has occured, the name of event/command or the Command Handler itself.
	 * @param {string | undefined} message - Default settings for an Error.
	 */
	constructor(where: string, message: string) {
		super(message);

		if (Error.captureStackTrace) Error.captureStackTrace(this, CommandHandlerError);

		this.name = 'CommandHandlerError';
		this.where = where;
		this.date = new Date();
	}
};
