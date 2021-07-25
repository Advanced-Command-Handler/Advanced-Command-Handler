/* eslint-disable jsdoc/require-jsdoc */
import {BetterEmbed} from 'discord.js-better-embed';
import {Command, CommandContext, Tag} from '../../classes';
import {CommandHandler, dayjs} from '../../CommandHandler';

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
	override name = 'help';
	override aliases = ['h'];
	override category = 'utils';
	override description = 'Get the list of commands or more information for one.';
	override usage = 'help\nhelp <command>';

	public override async run(ctx: CommandContext) {
		if (this.subCommands.find(s => s.name === 'all')!.nameAndAliases.includes(ctx.args[0])) return;

		if (!ctx.args.length || !ctx.handler.getCommandAliasesAndNames().includes(ctx.args[0])) {
			await HelpCommand.sendGlobalHelp(ctx);
		}
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

		CommandHandler.commands.forEach(c => {
			this.subCommand(c.name, {aliases: c.aliases}, async ctx => {
				await HelpCommand.sendCommandHelp(ctx, c);
			});
		});
	}

	public static async sendGlobalHelp(ctx: CommandContext) {
		const commandList = groupBy(ctx.handler.commands.array(), c => c.category!);

		const embed = BetterEmbed.fromTemplate('complete', {
			client: ctx.client,
			title: 'List of the commands.',
			description: `\`${ctx.handler.prefixes[0]}${ctx.commandName} <command>\` to get more information on a command.`,
		});

		Object.entries(commandList)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.forEach(([category, commands]) => {
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

		return ctx.reply(embed);
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
				if (s.description) subCommandDescription += `\`${this.name} ${s.name}\` : ${s.description}\n`;
			});
			if (subCommandDescription.length > 0) embed.addField('SubCommands :', subCommandDescription);
		}
		
		embed.cutIfTooLong();
		return ctx.reply(embed);
	}
}
