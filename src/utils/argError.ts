import {Message} from "discord.js";
import {BetterEmbed} from 'discord.js-better-embed';
import Command from '../classes/Command.js';

/**
 * Send embed who explains why user failed an argument of the Command.
 * @param {module:"discord.js".Message} message - Channel where embed will be sent.
 * @param {string} error - The mistake user made.
 * @param {Command} command - Which command failed.
 * @returns {void}
 */
export default (message: Message, error: string, command: Command) => {
	const embed = BetterEmbed.fromTemplate('title', {
		client: message.client,
		color: 0xee2200,
		title: 'Argument error :',
		description: error
	})

	if (command.usage) embed.addField('Syntax :', command.usage);
	
	if (message.client.channels.cache.has(message.channel.id)) message.channel.send({embed});
	else throw new Error(`The channel ${message} is not valid, an ID is expected, if an ID has been entered, then the bot does not have this channel.`);
};
