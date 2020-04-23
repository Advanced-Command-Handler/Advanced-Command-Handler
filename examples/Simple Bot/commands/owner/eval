const {Command} = require('advanced-command-handler');

module.exports = new Command({
  name: 'eval',
  description: 'A command for testing code directly in Discord',
  usage: 'eval <code>',
  aliases: ['js', 'testcode'],
  ownerOnly: true
}, async (client, message, args) => {
  eval(args.join(' '));
});
