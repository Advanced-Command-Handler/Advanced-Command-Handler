const {CommandHandler} = require('src/index.js');

CommandHandler.create({
	commandsDir: 'commands',
	eventsDir: 'events',
	prefixes: [';', 'bot!']
})

CommandHandler.launch({
	token: 'token'
});
