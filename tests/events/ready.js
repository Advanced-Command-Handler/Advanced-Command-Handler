import {Event, Logger} from 'advanced-command-handler';

export default class ReadyEvent extends Event {
	name = 'ready';

	async run(context, client) {
		Logger.log('ready !');
	}
}
