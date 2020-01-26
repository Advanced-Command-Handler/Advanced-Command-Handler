const {ShardingManager} = require('discord.js');
const config = require('informations/config.json');
const Logger = require('./utils/Logger.js');
const manager = new ShardingManager('main.js', {
	totalShards: 'auto',
	respawn    : true,
	token      : config.token
});
manager.spawn().then(() => {
	Logger.info("Bot is sharded !");
});
