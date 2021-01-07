const {CommandHandler, Logger} = require('../dist');
require('dotenv').config();

CommandHandler.create({
	eventsDir: 'events',
	commandsDir: 'commands',
	prefixes: ['!'],
})
	.setDefaultEvents()
	.launch({
		token: process.env.TOKEN,
	});

CommandHandler.on('create', options => {
	Logger.log(options);
});

CommandHandler.on('launched', () => {
	Logger.log('CommandHandler launched successfully !');
});
