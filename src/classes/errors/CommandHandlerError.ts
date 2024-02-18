import {CommandHandler} from '../../CommandHandler.js';

export class CommandHandlerError extends Error {
	/**
	 * When the error occurred.
	 */
	public readonly date: Date;
	/**
	 * Where the error occurred.
	 */
	public readonly where: string;

	/**
	 *
	 * @param message - The error message to explain what happens.
	 * @param where - Where the error occurred.
	 */
	public constructor(message: string, where: string) {
		super(message);

		if (Error.captureStackTrace) Error.captureStackTrace(this, CommandHandlerError);

		this.name = 'CommandHandlerError';
		this.where = where;
		this.date = new Date();

		if (this.constructor.name === 'CommandHandlerError') CommandHandler.emit('error', this);
	}
}
