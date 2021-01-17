const {CommandHandler, Logger} = require('../');
require('dotenv').config();

CommandHandler.create({
	eventsDir: 'events',
	commandsDir: 'commands',
	prefixes: ['!'],
})
	.setDefaultEvents()
	.setDefaultCommands()
	.launch({
		token: process.env.TOKEN,
	});

CommandHandler.on('create', options => {
	Logger.log(options);
});

CommandHandler.on('launched', () => {
	Logger.log('CommandHandler launched successfully !');
});
