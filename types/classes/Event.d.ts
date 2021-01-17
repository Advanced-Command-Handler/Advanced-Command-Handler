import { RunFunction } from '../types';
import AdvancedClient from './AdvancedClient';
interface EventsOptions {
    readonly name: string;
    once?: boolean;
}
export default class Event implements EventsOptions {
    readonly name: string;
    once: boolean;
    run: RunFunction;
    constructor(options: EventsOptions, runFunction: RunFunction);
    bind(client: AdvancedClient): void;
    unbind(client: AdvancedClient): void;
}
export {};
