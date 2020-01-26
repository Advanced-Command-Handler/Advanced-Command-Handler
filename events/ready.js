/** @module events/reeady */
const moment = require('moment');
const Logger = require('../utils/Logger.js');

/**
 * The ready event.
 * @param {Object} client - The client the event stand for.
 * @return {void}
 */
module.exports = async (client) => {
	Logger.info(`${Logger.setColor('#c0433f') + 'Bot loaded !'} Bot online with ${client.guilds.size + Logger.setColor('#c0433f')} guilds, he sees ${client.users.size + Logger.setColor('#c0433f')} members.`);
	Logger.log('Date : ' + Logger.setColor('yellow') + moment().format('llll'));
	Logger.log(`RAM used : ${Logger.setColor('magenta') + (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} ` + Logger.setColor('magenta') + 'MB');
	
	setInterval(() => {
		Logger.log('Date : ' + Logger.setColor('yellow') + moment().format('llll'));
		Logger.log(`RAM used : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} ` + Logger.setColor('magenta') + 'MB');
	}, 20 * 60 * 1000);
};