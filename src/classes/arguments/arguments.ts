import {Channel, Emoji, Guild, GuildMember, Message, Snowflake, User} from 'discord.js';
import {TextChannelLike} from '../../types';
import {getThing, isSnowflake, isTextChannelLike} from '../../utils';
import {Command} from '../commands';
import {Event} from '../Event';
import {Argument, ArgumentBuilder, ArgumentType} from './Argument';

function inRange(number: number | string, min: number, max: number = Infinity) {
	if (typeof number === 'string') number = number.length;
	return number >= min && number <= max;
}

export function booleanArgument(options: ArgumentBuilder<boolean> = {}) {
	return new Argument<boolean>(
		ArgumentType.BOOLEAN,
		options,
		argument => ['true', 'false'].includes(argument),
		argument => argument === 'true'
	);
}

export function channelArgument(options: ArgumentBuilder<Channel> = {}) {
	return new Argument(
		ArgumentType.CHANNEL,
		options,
		(argument, ctx) => isSnowflake(argument) || ctx.message.mentions.channels.size > 0 || (argument as string).length > 2,
		(_, ctx) => getThing('channel', ctx.message)
	);
}

export function choiceArgument(options: ArgumentBuilder<string> & {values: string[]}) {
	return new Argument(
		ArgumentType.CHOICE,
		options,
		argument => options.values.includes(argument),
		argument => options.values.find(e => e === argument) ?? null
	);
}

export function commandArgument(options: ArgumentBuilder<Command> = {}) {
	return new Argument(
		ArgumentType.COMMAND,
		options,
		(argument, ctx) => ctx.handler.getCommandAliasesAndNames().includes(argument),
		(argument, ctx) => ctx.handler.findCommand(argument) ?? null
	);
}

export function emojiArgument(options: ArgumentBuilder<Emoji> = {}) {
	const nativeEmojiRegex =
		/[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD]/;

	return new Argument(
		ArgumentType.EMOJI,
		options,
		argument => isSnowflake(argument) || /<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/.test(argument) || nativeEmojiRegex.test(argument),
		(_, ctx) => getThing('emote', ctx.message)
	);
}

export function enumArgument<E extends Record<string, V>, V>(options: ArgumentBuilder<V> & {values: E}) {
	return new Argument(
		ArgumentType.ENUM,
		options,
		argument => Object.keys(options.values).includes(argument),
		argument => Object.entries(options.values).find(e => e[0] === argument)?.[1] ?? null
	);
}

export function eventArgument(options: ArgumentBuilder<Event> = {}) {
	return new Argument(
		ArgumentType.EVENT,
		options,
		(argument, ctx) => ctx.handler.events.has(argument),
		(argument, ctx) => ctx.handler.events.get(argument) ?? null
	);
}

export function floatArgument(options: ArgumentBuilder<number> = {}) {
	return new Argument(
		ArgumentType.FLOAT,
		options,
		argument => !Number.isNaN(Number.parseFloat(argument)),
		argument => Number.parseFloat(argument)
	);
}

export function guildArgument(options: ArgumentBuilder<Guild> = {}) {
	return new Argument(
		ArgumentType.GUILD,
		options,
		(argument, ctx) => isSnowflake(argument) || ctx.client.guilds.cache.has(argument) || inRange(argument as string, 2, 100),
		(_, ctx) => getThing('guild', ctx.message)
	);
}

export function guildMemberArgument(options: ArgumentBuilder<GuildMember> = {}) {
	return new Argument(
		ArgumentType.GUILD_MEMBER,
		options,
		(argument, ctx) => isSnowflake(argument) || (ctx.message.mentions.members?.size ?? 0) > 0 || inRange(argument as string, 1, 100),
		(_, ctx) => getThing('member', ctx.message)
	);
}

export function intArgument(options: ArgumentBuilder<number> = {}) {
	return new Argument(
		ArgumentType.INTEGER,
		options,
		argument => !Number.isNaN(Number.parseInt(argument)),
		argument => Number.parseInt(argument)
	);
}

export function messageArgument(options: ArgumentBuilder<Message> = {}) {
	return new Argument(
		ArgumentType.MESSAGE,
		options,
		argument => isSnowflake(argument) || /https:\/\/((canary|ptb).)?discord.com\/channels\/\d{17,19}\/\d{17,19}\/\d{17,19}/.test(argument),
		(_, ctx) => getThing('message', ctx.message)
	);
}

export function snowflakeArgument(options: ArgumentBuilder<Snowflake> = {}) {
	return new Argument(ArgumentType.SNOWFLAKE, options, isSnowflake, argument => argument);
}

export function stringArgument(options: ArgumentBuilder<string> & {regex?: RegExp} = {}) {
	return new Argument(
		ArgumentType.STRING,
		options,
		argument => {
			if (options.regex) return options.regex.test(argument);
			return true;
		},
		argument => argument
	);
}

export function regexArgument(options: ArgumentBuilder<RegExp> = {}) {
	const regexRegex = /^\/(.+?)\/([gimsuy]{1,6})?$/imu;

	return new Argument(
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

export function textChannelArgument(options: ArgumentBuilder<TextChannelLike> = {}) {
	return new Argument(
		ArgumentType.TEXT_CHANNEL,
		options,
		(argument, ctx) => isSnowflake(argument) || ctx.message.mentions.channels.size > 0 || inRange(argument as string, 1, 100),
		async (argument, ctx) => {
			if (isSnowflake(argument)) {
				const channel = await ctx.client.channels.fetch(argument);
				return isTextChannelLike(channel) ? channel : null;
			}

			return getThing('text_channel', ctx.message);
		}
	);
}

export function userArgument(options: ArgumentBuilder<User> = {}) {
	return new Argument(
		ArgumentType.USER,
		options,
		(argument, ctx) => isSnowflake(argument) || ctx.message.mentions.users.size > 0 || inRange(argument as string, 2, 100),
		(_, ctx) => getThing('user', ctx.message)
	);
}
