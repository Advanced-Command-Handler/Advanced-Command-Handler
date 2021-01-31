const {Event, Logger} = require('advanced-command-handler');
module.exports = new Event(
	{
		name: 'ready',
		once: true,
	},
	async () => {
		Logger.log('ready !');
	}
);
