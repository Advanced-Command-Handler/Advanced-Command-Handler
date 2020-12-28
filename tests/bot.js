const {CommandHandler} = require('../');

CommandHandler.create({
	commandsDir: 'name of the dir',
	eventsDir: 'name of the dir',
	prefixes: ['!', 'coolPrefix '],
	owners: ['Discord IDs'],
});

CommandHandler.launch({
	token: 'YOUR TOKEN GOES HERE',
});
