import type {APIApplicationCommandBasicOption} from 'discord-api-types/v10';
import {Argument, type ArgumentOptions, type SlashCommandArgumentBuilder} from './Argument.js';

export type SlashCommandArgument<T, O extends ArgumentOptions<T>> = Argument<T, O> & {
	toSlashCommandArgument: (name: string) => APIApplicationCommandBasicOption;
	options: SlashCommandArgumentBuilder<T> & Omit<O, keyof ArgumentOptions<any>>;
};
