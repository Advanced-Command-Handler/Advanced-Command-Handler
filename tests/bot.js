const {CommandHandler} = require('../');
require('dotenv').config();

CommandHandler.create({
	prefixes: ['!'],
});

CommandHandler.launch({
	token: process.env.TOKEN,
});
