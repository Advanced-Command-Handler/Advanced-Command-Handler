import type {APIApplicationCommandBasicOption} from 'discord-api-types/v10';
import {Argument, type SlashCommandArgumentBuilder} from './Argument.js';

export type SlashCommandArgument<T> = Argument<T> & {
	toSlashCommandArgument: (name: string) => APIApplicationCommandBasicOption;
	options: SlashCommandArgumentBuilder<T>;
};
