import {Event, Logger} from 'advanced-command-handler';

module.exports = class ReadyEvent extends Event {
	name = 'ready';

	async run(context, client) {
		Logger.log('ready !');
	}
};
