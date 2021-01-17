export default class CommandHandlerError extends Error {
    readonly where: string;
    readonly date: Date;
    constructor(message: string, where: string);
}
