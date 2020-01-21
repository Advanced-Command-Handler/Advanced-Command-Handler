const {red, yellow} = require('chalk');
const Client = require('./classes/client.js');
const {token} = require('./informations/config.json');
const moment = require('moment');

const client = new Client(token);
console.log(`Start of bot loading at : ${yellow(moment().format('llll'))}`);

process.on('warning', (error) => {
	console.log(`An error occurred ${yellow(moment().format('llll'))}.\n\nError : ${error.stack}`);
});
process.on('uncaughtException', (error) => {
	console.log(`An error occurred ${yellow(moment().format('llll'))}.\n\nError : ${red(error.stack)}`);
});

module.exports = {client};

client.loadCommands('./commands/');
client.loadEvents('./events/');

console.log(`End of bot loading, waiting for the event ready.`);
