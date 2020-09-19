const {CommandHandler} = require('advanced-command-handler');

CommandHandler.create({
	commandsDir: 'commands',
	eventsDir: 'events',
	prefixes: [';', 'bot!'],
});

CommandHandler.launch({
	token: 'token',
});
