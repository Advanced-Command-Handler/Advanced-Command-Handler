const {CommandHandler} = require('../');
require('dotenv').config();

CommandHandler.create({
	eventsDir: 'events',
	commandsDir: 'commands',
	prefixes: ['!'],
}).launch({
	token: process.env.TOKEN,
});
