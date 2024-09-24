import {
	ActionRowBuilder,
	BaseSelectMenuBuilder,
	ButtonBuilder,
	ChannelSelectMenuBuilder,
	MentionableSelectMenuBuilder,
	RoleSelectMenuBuilder,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder,
} from '@discordjs/builders';
import {type APIActionRowComponent, ButtonStyle, ChannelType, ComponentType} from 'discord-api-types/v9';
import {type AnyChannel, Channel, Role, Snowflake, User} from 'discord.js';
import {CommandHandlerError} from '../errors/CommandHandlerError.js';

export type SelectMenuValueMap = {
	[ComponentType.ChannelSelect]: AnyChannel | Snowflake;
	[ComponentType.MentionableSelect]: Role | User | Snowflake;
	[ComponentType.RoleSelect]: Role | Snowflake;
	[ComponentType.StringSelect]: string;
	[ComponentType.UserSelect]: User | Snowflake;
};

export interface ButtonOptions {
	customId?: string;
	disabled?: boolean;
	label: string;
	style: ButtonStyle;
	url?: string;
}

export interface SelectMenuOption<T extends keyof SelectMenuValueMap> {
	description?: string;
	label: string;
	value: SelectMenuValueMap[T];
}

export interface SelectMenuOptions<T extends keyof SelectMenuValueMap> {
	customId: string;
	disabled?: boolean;
	maxValues?: number;
	minValues?: number;
	options: SelectMenuOption<T>[];
	placeholder?: string;
}

export interface SelectMenuChannelOptions {
	channelTypes?: (keyof typeof ChannelType | ChannelType)[];
}

export class ActionRow {
	private buttons: (Button | undefined)[] = [];
	private selectMenu: | RoleSelectMenuBuilder | ChannelSelectMenuBuilder | MentionableSelectMenuBuilder | UserSelectMenuBuilder | StringSelectMenuBuilder | undefined = undefined;

	addButton(options: ButtonOptions): this {
		if (this.buttons.length >= 5) {
			throw new CommandHandlerError('A row can have a maximum of 5 components', 'ActionRow.addButton');
		}
		const button = new Button(options.style, options.label, options.customId, options.url, options.disabled ?? false);
		this.buttons.push(button);
		return this;
	}

	setStringSelectMenu(options: SelectMenuOptions<ComponentType.StringSelect>): this {
		this.selectMenu = this.configureSelectMenu(new StringSelectMenuBuilder(), options).setOptions(options.options);
		return this;
	}

	setChannelSelectMenu(options: SelectMenuOptions<ComponentType.ChannelSelect> & SelectMenuChannelOptions): this {
		this.selectMenu = this.configureSelectMenu(new ChannelSelectMenuBuilder(), options)
		                      .setDefaultChannels(options.options.map(opt => opt.value instanceof Channel
		                                                                     ? opt.value.id
		                                                                     : opt.value as string));

		if (options.channelTypes) {
			this.selectMenu.setChannelTypes(options.channelTypes?.map(type => typeof type === 'string' ? ChannelType[type] : type) ?? []);
		}
		return this;
	}

	setRoleSelectMenu(options: SelectMenuOptions<ComponentType.RoleSelect>): this {
		this.selectMenu =
			this.configureSelectMenu(new RoleSelectMenuBuilder(), options).setDefaultRoles(options.options.map(opt => opt.value instanceof
			                                                                                                          Role
			                                                                                                          ? opt.value.id
			                                                                                                          : opt.value));
		return this;
	}

	setUserSelectMenu(options: SelectMenuOptions<ComponentType.UserSelect>): this {
		this.selectMenu = this.configureSelectMenu(new UserSelectMenuBuilder(), options)
		                      .setDefaultUsers(options.options.map(opt => opt.value instanceof User ? opt.value.id : opt.value));
		return this;
	}

	setMentionableSelectMenu(options: SelectMenuOptions<ComponentType.MentionableSelect>): this {
		this.selectMenu = this.configureSelectMenu(new MentionableSelectMenuBuilder(), options)
		                      .setDefaultValues(options.options.map(opt => ({
			                      id: opt.value instanceof Role || opt.value instanceof User ? opt.value.id : opt.value,
			                      type: opt.value instanceof Role ? 'role' : 'user',
		                      } as any)));
		return this;
	}

	toJSON(): APIActionRowComponent<any> {
		const components = [
			...this.buttons.map(button => button?.toBuilder()), this.selectMenu,
		].filter(component => component !== undefined);

		return new ActionRowBuilder().addComponents(...components).toJSON();
	}

	private configureSelectMenu<T extends keyof SelectMenuValueMap, B extends BaseSelectMenuBuilder<any>>(builder: B,
		options: SelectMenuOptions<T>,
	): B {
		if (this.buttons.length > 0) {
			throw new CommandHandlerError('A row can\'t have both buttons and select menus', 'ActionRow.configureSelectMenu');
		}

		if (this.selectMenu) {
			throw new CommandHandlerError('A row can\'t have multiple select menus', 'ActionRow.configureSelectMenu');
		}

		if (options.options.length === 0) {
			throw new CommandHandlerError('Select menu must have at least one option', 'ActionRow.configureSelectMenu');
		}

		builder.setCustomId(options.customId);

		if (options.placeholder) builder.setPlaceholder(options.placeholder);
		if (options.minValues) builder.setMinValues(options.minValues);
		if (options.maxValues) builder.setMaxValues(options.maxValues);

		return builder;
	}
}

export class Button {
	constructor(private style: ButtonStyle,
		private label: string,
		private customId?: string,
		private url?: string,
		private disabled: boolean = false,
	) {
		if (style === ButtonStyle.Link && !url) {
			throw new Error('URL is required for LINK buttons');
		}
		if (style !== ButtonStyle.Link && !customId) {
			throw new Error('Custom ID is required for non-LINK buttons');
		}
	}

	toBuilder(): ButtonBuilder {
		const button = new ButtonBuilder().setStyle(this.style).setLabel(this.label).setDisabled(this.disabled);

		if (this.style === ButtonStyle.Link) {
			button.setURL(this.url!);
		} else {
			button.setCustomId(this.customId!);
		}

		return button;
	}
}
