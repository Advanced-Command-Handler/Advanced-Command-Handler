const {Event, Logger} = require('advanced-command-hander');
module.exports = new Event(
	{
		name: 'ready',
		once: true,
	},
	async () => {
		Logger.log('ready !');
	}
);
