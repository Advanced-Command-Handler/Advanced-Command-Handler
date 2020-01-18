const os = require('os');
const {blue, magenta, magentaBright, red, yellow} = require('chalk');
const moment = require('moment');

module.exports = async (client) => {
	console.log(`${red('Bot loaded !')}\nBot online at ${magenta(client.guilds.size)} guilds, he sees ${blue(client.users.size)} members.`);
	console.log('\nDate : ' + yellow(moment().format('llll')));
	console.log(`RAM used : ${magentaBright((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + blue('MB'));
	
	setInterval(() => {
		console.log('\nDate : ' + yellow(moment().format('llll')));
		console.log(`RAM used : ${magentaBright((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + blue('MB'));
	}, 20 * 60 * 1000);
};
