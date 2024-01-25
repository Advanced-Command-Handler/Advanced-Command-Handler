import {Parser} from 'argumentorum';
import type {Awaitable} from 'discord.js';
import {ArgumentContext, CommandContext} from '../contexts';
import {CommandError, CommandErrorType} from '../errors';
import {CommandArgument} from './Argument';

export type MapArguments<A extends any[]> = Map<string, null | CommandError | A[number]>;
export type ArgumentResolved<A> = null | CommandError | A;
type MapToValuesType<T extends Map<any, any>> = ReturnType<T['values']> extends IterableIterator<infer V> ? V : never;

export class ArgumentParser {
	public static errors = {
		invalidArgument: (argumentName: string) => `Invalid argument '${argumentName}' provided from user.`,
		argumentNotFound: (argumentName: string) =>
			`Cannot resolve argument '${argumentName}', message is missing argument and argument is not optional and has no default value.`,
		argumentRequiresOneValue: (argumentName: string) => `Argument '${argumentName}' requires exactly one value bot none or multiple were provided.`,
		errorInArgument: (argumentName: string) => `Cannot resolve argument '${argumentName}', bad input from user.`,
	};
	public parsed?: Map<string, Awaitable<CommandError | null | any>>;
	public parser: Parser;

	public constructor(public args: CommandArgument<any>[], public rawArgs: string[]) {
		this.parser = new Parser(rawArgs.join(' '));
	}

	private static invalidArgumentError(argumentContext: ArgumentContext) {
		return new CommandError({
			type: CommandErrorType.INVALID_ARGUMENT,
			data: argumentContext,
			message: ArgumentParser.errors.invalidArgument(argumentContext.currentArgument.name),
		});
	}

	private static argumentNotFoundError(argumentContext: ArgumentContext) {
		return new CommandError({
			type: CommandErrorType.ARGUMENT_NOT_FOUND,
			data: argumentContext,
			message: ArgumentParser.errors.argumentNotFound(argumentContext.currentArgument.name),
		});
	}

	private static argumentRequiresOneValueError(argumentContext: ArgumentContext) {
		return new CommandError({
			type: CommandErrorType.INVALID_ARGUMENT,
			data: argumentContext,
			message: ArgumentParser.errors.argumentRequiresOneValue(argumentContext.currentArgument.name),
		});
	}

	private static errorInArgumentError(argumentContext: ArgumentContext) {
		return new CommandError({
			type: CommandErrorType.INVALID_ARGUMENT,
			data: argumentContext,
			message: ArgumentParser.errors.errorInArgument(argumentContext.currentArgument.name),
		});
	}

	public async parseArguments<A extends any[]>(context: CommandContext) {
		let argsMap = new Map<string, Awaitable<ArgumentResolved<A>>>();
		const keywordArgs = new Map<string, string[]>();
		const argsToParse = this.args.slice();

		this.parser.parseNamed().forEach(named => {
			const name = named.name.toLowerCase();
			keywordArgs.set(name, keywordArgs.get(name) ?? []);
			keywordArgs.get(name)?.push(named.data);
		});

		let currentArgument: CommandArgument<any> | undefined;
		let i = 0;

		while (true) {
			let argumentResult: MapToValuesType<typeof argsMap> = null;
			currentArgument = argsToParse.shift();
			if (!currentArgument) break;
			const keywordValue = keywordArgs.get(currentArgument.name.toLowerCase());
			const hasKeywordArgs = keywordValue !== undefined;
			const actualCursorIndex = this.parser.cursor.index;
			if (!this.parser.cursor.hasNext && !hasKeywordArgs && !currentArgument.defaultValue) continue;

			const argumentContext = new ArgumentContext({
				...context,
				index: i,
			});

			let toParse = hasKeywordArgs ? keywordValue![0] : this.parser.parseNext()?.data ?? '';
			let parsed = await currentArgument.parse(toParse, argumentContext);
			let error: CommandError | undefined;
			if (!currentArgument.validate(toParse, argumentContext)) error = ArgumentParser.invalidArgumentError(argumentContext);
			if (hasKeywordArgs && keywordValue?.length !== 1) error = ArgumentParser.argumentRequiresOneValueError(argumentContext);

			if (currentArgument.isSimple) {
				argumentResult = error ?? !parsed ? ArgumentParser.argumentNotFoundError(argumentContext) : parsed;
			} else if (currentArgument.defaultValue) {
				if (!parsed && argsToParse.length > 0) this.parser.cursor.index = actualCursorIndex;
				argumentResult = parsed ?? currentArgument.defaultValue;
			} else if (currentArgument.optional) {
				if (!parsed && argsToParse.length > 0) {
					this.parser.cursor.index = actualCursorIndex;
					i++;
					continue;
				}

				argumentResult = parsed;
			} else if (currentArgument.coalescing) {
				toParse += ` ${keywordValue?.join(' ') ?? this.parser.consumeRemaining()}`;

				const toParseCount = toParse.split(' ').length;
				if (hasKeywordArgs || toParseCount <= 0) error = ArgumentParser.invalidArgumentError(argumentContext);
				if (hasKeywordArgs) {
					if (toParseCount < keywordValue!.length) error = ArgumentParser.invalidArgumentError(argumentContext);
					error = toParseCount <= 0 ? ArgumentParser.invalidArgumentError(argumentContext) : undefined;
				}
				parsed = currentArgument.parse(toParse, argumentContext);

				argumentResult = error ?? parsed;
				if (currentArgument.optional) argumentResult ??= null;
				if (currentArgument.defaultValue) argumentResult = currentArgument.defaultValue;
			} else {
				argumentResult = ArgumentParser.errorInArgumentError(argumentContext);
			}

			argsMap.set(currentArgument.name, argumentResult);
			i++;
		}

		const argsRequiredCount = this.args.filter(a => !a.isSkipable);
		if (argsMap.size < argsRequiredCount.length) {
			for (let i = argsMap.size; i < argsRequiredCount.length; i++) {
				const currentArgument = argsRequiredCount[i];
				const argumentContext = new ArgumentContext({
					...context,
					index: i,
				});
				argumentContext.currentArgument = currentArgument;
				argsMap.set(currentArgument.name, ArgumentParser.argumentNotFoundError(argumentContext));
			}
		}

		this.parsed = argsMap;
	}

	public async resolveArgument<A>(commandContext: CommandContext, name: string): Promise<ArgumentResolved<A>> {
		if (this.parsed?.has(name)) return this.parsed.get(name) as A;
		await this.parseArguments(commandContext);
		return this.parsed!.get(name);
	}

	public async resolveArguments<A extends any[]>(context: CommandContext): Promise<MapArguments<A>> {
		if (this.parsed?.size === this.args.length) return this.parsed;
		await this.parseArguments<A>(context);
		return this.parsed!;
	}
}
