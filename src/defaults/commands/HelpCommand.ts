import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import {BetterEmbed} from 'discord.js-better-embed';
import {commandArgument, CommandHandler} from '../../';
import {Command, CommandContext, Tag} from '../../classes';
import HelpOptions = CommandHandler.HelpOptions;

dayjs.extend(durationPlugin);

/**
 * Group an array by property with a predicate.
 *
 * @typeParam T - The type of the values of the array.
 * @typeParam K - The property of the values.
 * @param array - The array to group.
 * @param predicate - The predicate to get the property.
 * @returns - The array grouped by {@link K}.
 */
function groupBy<T, K extends keyof any>(array: T[], predicate: (item: T) => K): Record<K, T[]> {
	return array.reduce((previous, currentItem) => {
		const group = predicate(currentItem);
		if (!previous[group]) previous[group] = [];
		previous[group].push(currentItem);
		return previous;
	}, {} as Record<K, T[]>);
}

export class HelpCommand extends Command {
	public static options: HelpOptions = {};
	override aliases = ['h'];
	override arguments = {
		command: commandArgument({optional: true}),
	};
	override category = 'utils';
	override description = 'Get the list of commands or more information for one.';
	override name = 'help';

	public override async run(ctx: CommandContext) {
		if (ctx.isCallingASubCommand) return;
		const command = await ctx.argument<Command>('command');
		if (command) await HelpCommand.sendCommandHelp(ctx, command);
		else await HelpCommand.sendGlobalHelp(ctx);
	}

	public static async sendGlobalHelp(ctx: CommandContext) {
		const commandList = groupBy([...ctx.handler.commands.values()], c => c.category!);

		const embed = BetterEmbed.fromTemplate('complete', {
			client: ctx.client,
			title: 'List of the commands.',
			description: `\`${ctx.handler.prefixes[0]}${ctx.commandName} <command>\` to get more information on a command.`,
		});

		if (HelpCommand.options.globalMenuUseList) {
			let commands = Object.values(commandList).flat();
			if (HelpCommand.options.globalMenuExcludeCommands) {
				commands = commands.filter(c => c.nameAndAliases.some(c => HelpCommand.options.globalMenuExcludeCommands!.includes(c)));
			}
			commands.sort((a, b) => a.name.localeCompare(b.name)).forEach(c => embed.addField(c.signature(), c.description ?? 'No description provided.'));
		} else {
			Object.entries(commandList)
				.sort((a, b) => a[0].localeCompare(b[0]))
				.forEach(([category, commands]) => {
					if (HelpCommand.options.globalMenuExcludeCommands) {
						commands = commands.filter(c => c.nameAndAliases.some(c => HelpCommand.options.globalMenuExcludeCommands!.includes(c)));
					}
					if (!commands.length) return;

					embed.addField(
						category,
						`\`${commands
							.filter(m => m.category === category)
							.map(c => c.name)
							.sort()
							.join('`, `')}\``
					);
				});
		}

		const message = await ctx.reply({embed});
		if (HelpCommand.options.deleteMessageAfterDelay) setInterval(message.delete, HelpCommand.options.deleteMessageAfterDelay * 1000);
		return message;
	}

	public static async sendCommandHelp(ctx: CommandContext, command: Command) {
		if (!CommandHandler.commands.map(c => c.name).includes(command.name)) return;

		let description = `**Description** : ${command.description ?? 'No description provided.'}\n`;
		description += `**Category** : \`${command.category}\`\n`;
		description += `Can you use it here : **${(await command.validate(ctx)) ? 'No' : 'Yes'}**`;

		const embed = BetterEmbed.fromTemplate('complete', {
			client: ctx.client,
			title: `Information on command ${command.name} :`,
			description,
		});

		if (command.usage) embed.addField('Usage :', command.usage);
		else embed.addField('Syntax :', command.signatures({showDefaultValues: true}));
		if (command.aliases) embed.addField('Aliases : ', `\`${command.aliases.sort().join('\n')}\``);
		if (command.tags)
			embed.addField(
				'Tags :',
				`\`${command.tags
					.map(t => (typeof t === 'string' ? t : Tag[t]))
					.sort()
					.join('\n')
					.toUpperCase()}\``
			);
		if (command.cooldown) embed.addField('Cooldown :', `${dayjs.duration(command.cooldown, 'seconds').asSeconds()} seconds`);

		if (command.subCommands) {
			let subCommandDescription = '';
			command.subCommands.forEach(s => {
				if (s.description) subCommandDescription += `\`${command.name} ${s.signature()}\` : ${s.description}\n`;
			});
			if (subCommandDescription.length > 0) embed.addField('SubCommands :', subCommandDescription);
		}

		embed.cutIfTooLong();
		return ctx.reply({embed});
	}

	public override async registerSubCommands() {
		this.subCommand(
			'all',
			{
				aliases: ['a', 'list', 'ls'],
				description: 'List all commands available.',
			},
			HelpCommand.sendGlobalHelp
		);
	}
}
