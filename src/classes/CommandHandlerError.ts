export default class CommandHandlerError extends Error {
	readonly where: string;
	readonly date: Date;
	
	constructor(message: string, where: string) {
		super(message);

		if (Error.captureStackTrace) Error.captureStackTrace(this, CommandHandlerError);

		this.name = 'CommandHandlerError';
		this.where = where;
		this.date = new Date();
	}
};
