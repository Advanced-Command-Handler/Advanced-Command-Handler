import {CommandHandler} from '../CommandHandler';

export class CommandHandlerError extends Error {
	/**
	 * Where the error occurred.
	 */
	public readonly where: string;
	/**
	 * When the error occurred.
	 */
	public readonly date: Date;

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

		CommandHandler.emit('error', this);
	}
}
