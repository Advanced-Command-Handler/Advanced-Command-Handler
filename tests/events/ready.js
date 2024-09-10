import {Event, Logger} from 'advanced-command-handler';

export default class ReadyEvent extends Event {
	name = 'ready';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async run(context, client) {
		Logger.log('ready !');
	}
}
