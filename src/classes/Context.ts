import { Message, NewsChannel, TextChannel, Guild, EmojiIdentifierResolvable } from "discord.js";
import { CommandHandler } from "../CommandHandler";
import { AdvancedClient } from "./AdvancedClient";

export class Context {
    /**
     * The message the context refer to
     */
    public message: Message


    /**
     * The client
     */
    public client: AdvancedClient | null

    /**
     * The prefixes
     */
    public prefix: string[]

    public constructor(handler: typeof CommandHandler ,message: Message) {
        this.message = message
        this.client = handler.client
        this.prefix = handler.prefixes
    }

    /**
     * @returns TextChannel | null | NewsChannel
     */
    public get channel () {
        return this.message.channel
    }

    /**
     * @returns Guild | null
     */
    public get guild () {
        return this.message.guild
    }

    /**
     * @returns User
     */
    public get author () {
        return this.message.author
    }

    /**
     * @returns GuildMember | null
     */
    public get member () {
        return this.message?.member
    }

    /**
     * @returns GuildMember | null
     */
    public get me () {
        return this.guild?.me
    }

    /**
     * @returns string | null
     */
    public get prefixUsed () {
        for (const prefix of this.prefix) {
            if (this.message.content.startsWith(prefix)) return prefix
        }
        return null
    }

    public get args () {
        if (!this.prefixUsed) return null
        else return this.message.content.slice(this.prefixUsed?.length).split(/ +/g).slice(1)
    }

    public send = (content: any) => {
        this.channel.send(content)
    }

    public react = (emoji: EmojiIdentifierResolvable) => {
        this.message.react(emoji)
    }

    public reacts = async (emojis: EmojiIdentifierResolvable[]) => {
        for (const emoji of emojis) {
            await this.react(emoji)
        }
    }
}