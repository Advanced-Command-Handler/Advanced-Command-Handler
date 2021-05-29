const {Event, Logger} = require('advanced-command-handler');

module.exports = class ReadyEvent extends Event {
	name = 'ready';

	async run(context) {
		console.log(context);
		Logger.log('ready !');
	}
};
