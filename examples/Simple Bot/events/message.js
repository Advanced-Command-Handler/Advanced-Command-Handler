const {getThing} = require('advanced-command-handler');

module.exports = async (handler, message) => {
	
  // Not responding to bot or system messages.
  if (message.author.bot || message.system) return;
  
  // Getting the prefix from the prefixes registered in the handler.
  let prefix = '';
  for (const thisPrefix of handler.prefixes) {
    if (message.content.startsWith(thisPrefix)) {
      prefix = thisPrefix;
    }
  }
  
  // Best way to create args (believe in me).
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
	
  // Getting the command
  const cmd = await getThing('command', args[0].toLowerCase().normalize());
  args.shift();
  
  if (cmd && prefix) {
	  
    // Testing if author isn't an owner and command is ownerOnly.
    if ( !handler.client.isOwner(message.author.id) && (['owner', 'wip', 'mod'].includes(cmd.category) || cmd.ownerOnly)) {
      return await message.channel.send('You are not allowed to execute this command.');
    }
    
    // Testing if command hasn't been executed on a guild and command is guildOnly.
    if (!message.guild && cmd.guildOnly) {
      return await message.channel.send('Command is only allowed on a guild.');
    }
    
    // Testing if command hasn't been executed on a NSFW channel and command is nsfw.
    if (!message.channel.nsfw && cmd.nsfw) {
      return await message.channel.send('Command is only allowed on a NSFW channel.');
    }
    
    // Executing the command
    return cmd.run(handler.client, message, args);
});
