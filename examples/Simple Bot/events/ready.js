const {Logger} = require('advanced-command-handler');
const {DateTime} = require('luxon');

module.exports = async (handler) => {
	/**
	 * Log information of the bot in the console.
	 * @returns {void}
	 */
	function log() {
		Logger.event(`Date : ${Logger.setColor('yellow', DateTime.local().toFormat('TT'))}`);
		Logger.event(`RAM used  : ${Logger.setColor('magenta', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + Logger.setColor('magenta', 'MB'));
	}
	
	Logger.event(
		Logger.setColor('#c0433f', `Client online ! Client ${
			Logger.setColor('orange', handler.client.user.username, '#c0433f')} has ${
			handler.client.guilds.cache.size + Logger.setColor('#c0433f')
		} guilds, it sees ${
			handler.client.users.cache.size + Logger.setColor('#c0433f')
		} users.`)
	);
	
	log();
	setInterval(() => {
		log();
	}, 20 * 60 * 1000);
};
