module.exports = class CommandHandlerError extends Error {
	place;
	
	/**
	 * @param place - Place where this has occured, the name of event/command or the Command HAandler itself.
	 * @param params - Default settings for an Error.
	 */
	constructor(place, ...params) {
		super(...params);
		
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CommandHandlerError);
		}
		
		this.name = 'CommandHandlerError';
		this.place = place;
		this.date = new Date();
	}
}