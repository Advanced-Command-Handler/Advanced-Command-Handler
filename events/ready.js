/** @module events/reeady */
const {DateTime} = require('luxon');
const Logger = require('../utils/Logger.js');

/**
 * The ready event.
 * @param {Object} client - The client the event stand for.
 * @return {void}
 */
module.exports = async (client) => {
	Logger.event(
		Logger.setColor('#c0433f', `Client online ! Client ${
			Logger.setColor('orange', client.user.username, '#c0433f')
		} has ${client.guilds.size + Logger.setColor('#c0433f')} guilds, it sees ${client.users.size + Logger.setColor('#c0433f')} members.`)
	);
	
	Logger.event('Date : ' + Logger.setColor('yellow', DateTime.local().toFormat('TT')));
	Logger.event(`RAM used : ${Logger.setColor('magenta', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + Logger.setColor('magenta', 'MB'));
	
	setInterval(() => {
		Logger.event('Date : ' + Logger.setColor('yellow', DateTime.local().toFormat('TT')));
		Logger.event(`RAM used : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} ` + Logger.setColor('magenta', 'MB'));
	}, 20 * 60 * 1000);
}
;
