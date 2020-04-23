const {CommandHandler} = require('advanced-command-handler');

CommandHandler.create({
	commandsDir: 'commands',
	eventsDir: 'events',
	prefixes: ['!']
})

CommandHandler.launch({
	token: 'Your token goes here'
});
