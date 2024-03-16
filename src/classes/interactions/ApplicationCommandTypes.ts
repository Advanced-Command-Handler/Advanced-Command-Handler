class Type {
	/**
	 * Creates a new type.
	 *
	 * @param path The path to the folder.
	 * @param logName The name of the type.
	 */
	constructor(
		public readonly path: string,
		public readonly logName: string
	) {}

	/**
	 * The capitalized name of the type.
	 */
	public get logNameCapitalized() {
		return this.logName.charAt(0).toUpperCase() + this.logName.slice(1);
	}

	/**
	 * The plural name of the type.
	 */
	public get logNamePlural() {
		return `${this.logName}s`;
	}

	/**
	 * The plural capitalized name of the type.
	 */
	public get logNamePluralCapitalized() {
		return this.logNamePlural.charAt(0).toUpperCase() + this.logNamePlural.slice(1);
	}
}

export type ApplicationCommandType = (typeof ApplicationCommandTypes)[keyof typeof ApplicationCommandTypes];

export const ApplicationCommandTypes = {
	MESSAGE: new Type('messageCommands', 'message command'),
	SLASH: new Type('slashCommands', 'slash command'),
	USER: new Type('userCommands', 'user command'),
} as const;
