import type {RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v10';

export abstract class ApplicationCommand {
	public abstract readonly name: string;

	public abstract run(ctx: any): Promise<void>;

	public abstract toJSON(): RESTPostAPIApplicationCommandsJSONBody;
}
