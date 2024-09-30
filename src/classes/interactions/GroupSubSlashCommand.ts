import type {APIApplicationCommandSubcommandGroupOption} from 'discord-api-types/v10';
import {SlashCommandSubcommandGroupBuilder} from 'discord.js';
import {Logger} from '../../helpers/Logger.js';
import type {SlashCommandArguments} from '../arguments/CommandArgument.js';
import {SubSlashCommand} from './SlashCommand.js';
import type {RunSubSlashCommandFunction, SubSlashCommandOptions} from './SubSlashCommand.js';

export class GroupSubSlashCommand {
	public readonly name: string;
	public readonly description: string;
	public subCommands: SubSlashCommand<any>[] = [];

	public constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
	}

	public subCommand<T extends SubSlashCommand<A>, A extends SlashCommandArguments = T['arguments']>(name: string,
		options: SubSlashCommandOptions<A>, callback: RunSubSlashCommandFunction<T>,
	) {
		if (this.subCommands.map(c => c.name).includes(name)) return;

		const subCommand = new SubSlashCommand(name, options, callback);
		this.subCommands.push(subCommand);

		Logger.comment(`Loaded subcommand '${Logger.setColor('green', `${this.name} ${name}'`)}.`, 'SubCommandLoading');
		return subCommand;
	}

	public toJSONOption(): APIApplicationCommandSubcommandGroupOption {
		const groupJSONBody = new SlashCommandSubcommandGroupBuilder().setName(this.name).setDescription(this.description);

		const subCommands = this.subCommands.map(subCommand => subCommand.toJSONOption());
		return {
			...groupJSONBody.toJSON(),
			options: [...subCommands],
		};
	}
}
