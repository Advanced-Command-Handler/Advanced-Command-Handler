module.exports = class CommandHandlerError extends Error {
	where;
	
	/**
	 * @param where - Place where this has occured, the name of event/command or the Command Handler itself.
	 * @param params - Default settings for an Error.
	 */
	constructor(where, ...params) {
		super(params);
		
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CommandHandlerError);
		}
		
		this.name = 'CommandHandlerError';
		this.where = where;
		this.date = new Date();
	}
};
