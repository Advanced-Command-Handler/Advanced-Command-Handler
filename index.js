const {ShardingManager} = require('discord.js');
const config = require('./informations/stocks/config.json');
const manager = new ShardingManager('./main.js', {
	totalShards: 'auto',
	respawn    : true,
	token      : config.token
});
manager.spawn().then(() => {
});
