import {CommandHandlerError} from './CommandHandlerError';

export enum CommandErrorType {
	ARGUMENT_NOT_FOUND,
	CLIENT_MISSING_PERMISSIONS,
	COOLDOWN,
	ERROR,
	INVALID_ARGUMENT,
	MISSING_TAGS,
	USER_MISSING_PERMISSIONS,
	WRONG_CHANNEL,
}

/**
 * The object to create a new CommandError.
 */
export interface CommandErrorBuilder {
	/**
	 * The data of the error, can be anything but should be related to the error type.
	 *
	 * @see CommandErrorBuilder#type.
	 */
	data?: any;
	/**
	 * The message of the error, to inform what is the problem.
	 */
	message: string;
	/**
	 * The type of error.
	 */
	type: CommandErrorType;
}

export class CommandError extends CommandHandlerError {
	/**
	 * The data of the error, can be anything but should be related to the error type.
	 *
	 * @see CommandErrorBuilder#type.
	 */
	public readonly data: any;
	/**
	 * The type of CommandError.
	 */
	public readonly type: CommandErrorType;

	/**
	 * Creates a new CommandError.
	 *
	 * @see {@link CommandErrorType} to see what those errors are related to.
	 * @see {@link Command#validate} to see when those errors can occur.
	 * @param options - The options of the error, containing type and raw data.
	 */
	public constructor(options: CommandErrorBuilder) {
		super(options.message, 'CommandExecution');
		this.name = 'CommandError';
		this.type = options.type;
		this.data = options.data ?? {};
	}
}
