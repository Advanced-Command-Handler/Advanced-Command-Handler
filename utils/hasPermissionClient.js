module.exports = (message, permission) => {
	return message.guild === null || message.guild === undefined ? false : message.guild.me.hasPermission(permission, true, false, false);
};