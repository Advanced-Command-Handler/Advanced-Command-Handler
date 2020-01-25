const Command = require('classes/Command.js');

module.exports = new Command({
    name: 'test',
    description: 'A simple test command',
    aliases: ['t']
}, async (client, message) => {
	message.channel.send('Hello Discord!');
});