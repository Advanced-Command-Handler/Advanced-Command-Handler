export declare const LogType: {
    error: string;
    warn: string;
    info: string;
    event: string;
    log: string;
    test: string;
    comment: string;
};
export declare const colors: {
    red: string;
    orange: string;
    gold: string;
    yellow: string;
    green: string;
    teal: string;
    blue: string;
    indigo: string;
    violet: string;
    magenta: string;
    pink: string;
    brown: string;
    black: string;
    grey: string;
    white: string;
    default: string;
};
export declare type ColorResolvable = NonNullable<keyof typeof colors | keyof typeof LogType | string>;
export declare class Logger {
    static logComments: boolean;
    static comment(message: any, title?: string): void;
    static error(message: any, title?: string): void;
    static event(message: any, title?: string): void;
    static info(message: any, title?: string): void;
    static log(message: any, title?: string, color?: ColorResolvable): void;
    static setColor(color?: ColorResolvable, text?: string): string;
    static test(message: any, title?: string): void;
    static warn(message: any, title?: string): void;
    protected static process(text: any, color?: ColorResolvable, title?: string): void;
    private static getColorFromColorResolvable;
    private static propertyInEnum;
}
