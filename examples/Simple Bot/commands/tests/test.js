const {Command} = require('src/index.js');

module.exports = new Command({
	name             : 'test',
	description      : 'A simple test command',
	aliases          : ['t'],
	ownerOnly        : true,
	guildOnly        : true,
	clientPermissions: ['MANAGE_GUILD']
}, async (client, message) => {
	message.channel.send('Hello, Discord!');
});
