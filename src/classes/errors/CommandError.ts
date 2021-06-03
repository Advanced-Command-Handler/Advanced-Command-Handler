import {CommandHandlerError} from './CommandHandlerError';

export enum CommandErrorType {
	CLIENT_MISSING_PERMISSIONS,
	USER_MISSING_PERMISSIONS,
	MISSING_TAGS,
	WRONG_CHANNEL,
	COOLDOWN,
	ERROR,
}

export interface CommandErrorBuilder {
	message: string;
	type: CommandErrorType;
	data?: any;
}

export class CommandError extends CommandHandlerError {
	public readonly type: CommandErrorType;
	public readonly data: any;

	public constructor(options: CommandErrorBuilder) {
		super(options.message, 'CommandExecution');
		this.type = options.type;
		this.data = options.data ?? {};
	}
}
