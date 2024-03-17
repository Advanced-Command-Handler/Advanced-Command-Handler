import {
	type APIApplicationCommandBooleanOption,
	type APIApplicationCommandChannelOption,
	APIApplicationCommandIntegerOption,
	APIApplicationCommandNumberOption,
	APIApplicationCommandStringOption,
	APIApplicationCommandUserOption,
	ApplicationCommandOptionType,
	ChannelType,
} from 'discord-api-types/v10';
import {Channel, Emoji, Guild, GuildMember, type GuildTextBasedChannel, Message, Snowflake, User} from 'discord.js';
import {getThing} from '../../helpers/getThing.js';
import {isSnowflake, isTextChannelLike} from '../../helpers/utils.js';
import type {Command} from '../commands/Command.js';
import {Event} from '../Event.js';
import {Argument, type ArgumentBuilder, ArgumentType} from './Argument.js';

/**
 * Check if a number is in a range.
 *
 * @param number - The number to check.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns - Whether the number is in the range.
 */
function inRange(number: number | string, min: number, max: number = Infinity) {
	if (typeof number === 'string') number = number.length;
	return number >= min && number <= max;
}

/**
 * Creates a boolean argument.
 * The value can only be `true` or `false`.
 *
 * @param options - The options of the argument.
 * @returns - A boolean Argument.
 */
export function booleanArgument(options: ArgumentBuilder<boolean> = {}) {
	return Argument.create(
		ArgumentType.BOOLEAN,
		options,
		argument => ['true', 'false'].includes(argument),
		argument => argument === 'true',
		(name): APIApplicationCommandBooleanOption => ({
			type: ApplicationCommandOptionType.Boolean,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
		})
	);
}

/**
 * Creates a channel argument.
 * The value can be a mention, an ID, or a part of a channel from the entire client.
 *
 * @param options - The options of the argument.
 * @returns - A channel Argument.
 */
export function channelArgument(options: ArgumentBuilder<Channel> = {}) {
	return Argument.create(
		ArgumentType.CHANNEL,
		options,
		(argument, ctx) => isSnowflake(argument) || ctx.message.mentions.channels.size > 0 || (argument as string).length > 2,
		(_, ctx) => getThing('channel', ctx.message),
		(name): APIApplicationCommandChannelOption => ({
			type: ApplicationCommandOptionType.Channel,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
		})
	);
}

/**
 * Creates a choice argument.
 * You must put the values possible as a string array.
 * The value can be anything contained in the array.
 *
 * @param options - The options of the argument.
 * @returns - A choice argument.
 */
export function choiceArgument(options: ArgumentBuilder<string> & {values: string[]}) {
	return Argument.create(
		ArgumentType.CHOICE,
		options,
		argument => options.values.includes(argument),
		argument => options.values.find(e => e === argument) ?? null,
		(name): APIApplicationCommandStringOption => ({
			type: ApplicationCommandOptionType.String,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
			choices: options.values.map(value => ({
				name: value,
				value,,
			})),
		},)
	)
}

/**
 * Creates a command argument.
 * The value can be an alias or the name of a command.
 *
 * @param options - The options of the argument.
 * @returns - A command argument.
 */
export function commandArgument(options: ArgumentBuilder<Command> = {}) {
	return Argument.create(
		ArgumentType.COMMAND,
		options,
		(argument, ctx) => ctx.handler.getCommandAliasesAndNames().includes(argument),
		(argument, ctx) => ctx.handler.findCommand(argument) ?? null
	);
}

/**
 * Creates a emoji argument.
 * The value can be a native emoji or a custom emoji.
 *
 * @param options - The options of the argument.
 * @returns - A emoji argument.
 */
export function emojiArgument(options: ArgumentBuilder<Emoji> = {}) {
	const nativeEmojiRegex =
		/[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD]/;

	return Argument.create(
		ArgumentType.EMOJI,
		options,
		argument => isSnowflake(argument) || /<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/.test(argument) || nativeEmojiRegex.test(argument),
		(_, ctx) => getThing('emote', ctx.message)
	);
}

/**
 * Creates a enum argument.
 * You must put an enum (or a record) of the possible values.
 * The value can be any key of the possible values and it will return the value of the entry.
 *
 * @param options - The options of the argument.
 * @returns - A enum argument.
 */
export function enumArgument<E extends Record<string, V>, V>(options: ArgumentBuilder<V> & {values: E}) {
	return Argument.create(
		ArgumentType.ENUM,
		options,
		argument => Object.keys(options.values).includes(argument),
		argument => Object.entries(options.values).find(e => e[0] === argument)?.[1] ?? null,
		(name): APIApplicationCommandStringOption => ({
			type: ApplicationCommandOptionType.String,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
			choices: Object.entries(options.values).map(([name, value]) => ({
				name,
				value: String(value),
			})),
		}),
	);
}

/**
 * Creates a event argument.
 * The value can can be any event name.
 *
 * @param options - The options of the argument.
 * @returns - A event argument.
 */
export function eventArgument(options: ArgumentBuilder<Event> = {}) {
	return Argument.create(
		ArgumentType.EVENT,
		options,
		(argument, ctx) => ctx.handler.events.has(argument),
		(argument, ctx) => ctx.handler.events.get(argument) ?? null
	);
}

/**
 * Creates a float argument.
 * The value can be any int or float number.
 *
 * @param options - The options of the argument.
 * @returns - A float argument.
 */
export function floatArgument(options: ArgumentBuilder<number> = {}) {
	return Argument.create(
		ArgumentType.FLOAT,
		options,
		argument => !Number.isNaN(Number.parseFloat(argument)),
		argument => Number.parseFloat(argument),
		(name): APIApplicationCommandNumberOption => ({
			type: ApplicationCommandOptionType.Number,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
		}),
	);
}

/**
 * Creates a guild argument.
 * The value can be an ID or a name of a guild of the client.
 *
 * @param options - The options of the argument.
 * @returns - A guild argument.
 */
export function guildArgument(options: ArgumentBuilder<Guild> = {}) {
	return Argument.create(
		ArgumentType.GUILD,
		options,
		(argument, ctx) => isSnowflake(argument) || ctx.client.guilds.cache.has(argument) || inRange(argument as string, 2, 100),
		(_, ctx) => getThing('guild', ctx.message)
	);
}

/**
 * Creates a guildMember argument.
 * The value can be an ID, mention, nickname or username of any member from the actual guild where the command was executed.
 * If executed in DM it will always return `null`.
 *
 * @param options - The options of the argument.
 * @returns - A guildMember argument.
 */
export function guildMemberArgument(options: ArgumentBuilder<GuildMember> = {}) {
	return Argument.create(
		ArgumentType.GUILD_MEMBER,
		options,
		(argument, ctx) => isSnowflake(argument) || (ctx.message.mentions.members?.size ?? 0) > 0 || inRange(argument as string, 1, 100),
		(_, ctx) => getThing('member', ctx.message),
		(name): APIApplicationCommandUserOption => ({
			type: ApplicationCommandOptionType.User,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
		}),
	);
}

/**
 * Creates a int argument.
 * The value can be any integer.
 *
 * @param options - The options of the argument.
 * @returns - A int argument.
 */
export function intArgument(options: ArgumentBuilder<number> = {}) {
	return Argument.create(
		ArgumentType.INTEGER,
		options,
		argument => !Number.isNaN(Number.parseInt(argument)),
		argument => Number.parseInt(argument),
		(name): APIApplicationCommandIntegerOption => ({
			type: ApplicationCommandOptionType.Integer,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
		}),
	);
}

/**
 * Creates a message argument.
 * The value can be any ID or URL of a message, if the value is an ID it will search in the last 100 messages of all the channels of the current guild.
 *
 * @param options - The options of the argument.
 * @returns - A message argument.
 */
export function messageArgument(options: ArgumentBuilder<Message> = {}) {
	return Argument.create(
		ArgumentType.MESSAGE,
		options,
		argument => isSnowflake(argument) || /https:\/\/((canary|ptb).)?discord.com\/channels\/\d{17,19}\/\d{17,19}\/\d{17,19}/.test(argument),
		(_, ctx) => getThing('message', ctx.message)
	);
}

/**
 * Creates a snowflake argument.
 * The value can be any value that ressemble a snowflake.
 *
 * @see {@link https://discord.com/developers/docs/reference#snowflakes}
 *
 * @param options - The options of the argument.
 * @returns - A snowflake argument.
 */
export function snowflakeArgument(options: ArgumentBuilder<Snowflake> = {}) {
	return Argument.create(
		ArgumentType.SNOWFLAKE,
		options,
		isSnowflake,
		argument => argument,
		name => ({
			type: ApplicationCommandOptionType.String,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
			min_length: 17,
			max_length: 20,
		}),
	);
}

/**
 * Creates a string argument.
 * The value can be anything.
 * It can also be filtered using the optional `regex` option.
 *
 * @param options - The options of the argument.
 * @returns - A string argument.
 */
export function stringArgument(options: ArgumentBuilder<string> & {regex?: RegExp} = {}) {
	return Argument.create(
		ArgumentType.STRING,
		options,
		argument => {
			if (options.regex) return options.regex.test(argument);
			return true;
		},
		argument => argument,
		name => ({
			type: ApplicationCommandOptionType.String,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
		}),
	);
}

/**
 * Creates a regex argument.
 * The value must be any valid JS regex, it also supports flags.
 *
 * @param options - The options of the argument.
 * @returns - A regex argument.
 */
export function regexArgument(options: ArgumentBuilder<RegExp> = {}) {
	const regexRegex = /^\/(.+?)\/([gimsuy]{1,6})?$/imu;

	return Argument.create(
		ArgumentType.REGEX,
		options,
		argument => {
			let isValid = true;
			try {
				const [, regex, flags = ''] = argument.match(regexRegex) as [string, string, string];
				new RegExp(regex, flags);
			} catch (ignored) {
				isValid = false;
			}
			return isValid;
		},
		argument => {
			try {
				const [, regex, flags = ''] = argument.match(regexRegex) as [string, string, string];
				return new RegExp(regex, flags);
			} catch (ignored) {
				return null;
			}
		}
	);
}

/**
 * Creates a textChannel argument.
 * The value can be an ID, mention or name of a TextChannel or a NewsChannel.
 * If a channel is found but is not a TextChannel or a NewsChannel, it will returns null.
 *
 * @param options - The options of the argument.
 * @returns - A textChannel argument.
 */
export function textChannelArgument(options: ArgumentBuilder<GuildTextBasedChannel> = {}) {
	return Argument.create(
		ArgumentType.TEXT_CHANNEL,
		options,
		(argument, ctx) => isSnowflake(argument) || ctx.message.mentions.channels.size > 0 || inRange(argument as string, 1, 100),
		async (argument, ctx) => {
			if (isSnowflake(argument)) {
				const channel = await ctx.client.channels.fetch(argument);
				return isTextChannelLike(channel) ? channel : null;
			}

			return getThing('text_channel', ctx.message);
		},
		(name): APIApplicationCommandChannelOption => ({
			type: ApplicationCommandOptionType.Channel,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
			channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
		}),
	);
}

/**
 * Creates a user argument.
 * The value can be an ID, mention or username of an user.
 *
 * @param options - The options of the argument.
 * @returns - A user argument.
 */
export function userArgument(options: ArgumentBuilder<User> = {}) {
	return Argument.create(
		ArgumentType.USER,
		options,
		(argument, ctx) => isSnowflake(argument) || ctx.message.mentions.users.size > 0 || inRange(argument as string, 2, 100),
		(_, ctx) => getThing('user', ctx.message),
		(name): APIApplicationCommandUserOption => ({
			type: ApplicationCommandOptionType.User,
			name,
			description: options.description ?? '',
			required: 'optional' in options ? !options.optional : true,
		}),
	);
}
