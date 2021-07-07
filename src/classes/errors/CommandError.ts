import {CommandHandlerError} from './CommandHandlerError';

export enum CommandErrorType {
	CLIENT_MISSING_PERMISSIONS,
	USER_MISSING_PERMISSIONS,
	MISSING_TAGS,
	WRONG_CHANNEL,
	COOLDOWN,
	ERROR,
}

/**
 * The object to create a new CommandError.
 */
export interface CommandErrorBuilder {
	/**
	 * The message of the error, to inform what is the problem.
	 */
	message: string;
	/**
	 * The type of error.
	 */
	type: CommandErrorType;
	/**
	 * The data of the error, can be anything but should be related to the error type.
	 *
	 * @see CommandErrorBuilder#type.
	 */
	data?: any;
}

export class CommandError extends CommandHandlerError {
	/**
	 * The type of CommandError.
	 */
	public readonly type: CommandErrorType;
	/**
	 * The data of the error, can be anything but should be related to the error type.
	 *
	 * @see CommandErrorBuilder#type.
	 */
	public readonly data: any;

	/**
	 * Creates a new CommandError.
	 *
	 * @see {@link CommandErrorType} to see what those errors are related to.
	 * @see {@link Command#validate} to see when those errors can occur.
	 * @param options - The options of the error, containing type and raw data.
	 */
	public constructor(options: CommandErrorBuilder) {
		super(options.message, 'CommandExecution');
		this.type = options.type;
		this.data = options.data ?? {};
	}
}
