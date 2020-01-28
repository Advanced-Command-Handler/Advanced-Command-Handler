const Logger = require('./utils/Logger.js');
const {readFileSync} = require('fs');
Logger.logComments = true;
try {
	console.log(Logger.setColor('magenta', readFileSync('./informations/presentation.txt').toString()));
} catch (e) {
	console.log(Logger.setColor('orange', 'Advanced Command Handler BY AYFRI'));
}

Logger.info(`Start of bot loading.`, 'loading');

const Client = require('./classes/Client.js');
const {token} = require('./informations/config.json');
const client = new Client(token);

process.on('warning', (error) => {
	Logger.error(`An error occurred. \nError : ${error.stack}`);
});
process.on('uncaughtException', (error) => {
	Logger.error(`An error occurred. \nError : ${error.stack}`);
});

/**
 * Exporting the client for functions and classes.
 * @type {{client: AdvancedClient}}
 */
module.exports = client;

client.loadCommands('./commands/');
client.loadEvents('./events/');

Logger.log('End of bot loading, waiting for the event ready.', 'loading');
