const Logger = require('./utils/Logger.js');
const Client = require('./classes/Client.js');
const {token} = require('./informations/config.json');
const moment = require('moment');

const client = new Client(token);
Logger.info(`Start of bot loading at : ${Logger.setColor('yellow') + moment().format('llll')}`, 'loading');

process.on('warning', (error) => {
	Logger.error(`An error occurred ${Logger.setColor('yellow') + moment().format('llll')}.\n\n${Logger.setColor('red')}Error : ${error.stack}`);
});
process.on('uncaughtException', (error) => {
	Logger.error(`An error occurred ${Logger.setColor('yellow') + moment().format('llll')}.\n\n${Logger.setColor('red')}Error : ${error.stack}`);
});

/**
 * Exporting the client for functions and classes.
 * @type {{client: AdvancedClient}}
 */
module.exports = client;

client.loadCommands('./commands/');
client.loadEvents('./events/');

Logger.test("test " + Logger.setColor('violet', "oui") + " lol");
Logger.log("End of bot loading, waiting for the event ready.", 'loading');
