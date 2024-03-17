import type {APIApplicationCommandOption} from 'discord-api-types/v10';
import {Argument, type SlashCommandArgumentBuilder} from './Argument.js';

export type SlashCommandArgument<T> = Argument<T> & {
	toSlashCommandArgument: (name: string) => APIApplicationCommandOption;
	options: SlashCommandArgumentBuilder<T>;
};
