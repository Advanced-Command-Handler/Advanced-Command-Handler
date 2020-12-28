const {CommandHandler} = require('../');

CommandHandler.create({
	prefixes: ['!'],
});

CommandHandler.launch({
	token: process.env.TOKEN,
});
