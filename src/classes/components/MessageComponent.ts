import {
	ActionRowBuilder,
	type AnyComponentBuilder,
	ButtonBuilder,
	ChannelSelectMenuBuilder,
	MentionableSelectMenuBuilder,
	RoleSelectMenuBuilder,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder,
} from '@discordjs/builders';
import {type APIActionRowComponent, ButtonStyle, ComponentType} from 'discord-api-types/v9';
import {Channel, Role, User} from 'discord.js';
import {CommandHandlerError} from '../errors/CommandHandlerError.js';

type SelectMenuTypes =
	| ComponentType.ChannelSelect
	| ComponentType.MentionableSelect
	| ComponentType.RoleSelect
	| ComponentType.StringSelect
	| ComponentType.UserSelect;

type SelectMenuValueMap = {
	[ComponentType.ChannelSelect]: Channel;
	[ComponentType.MentionableSelect]: User | Role | Channel;
	[ComponentType.RoleSelect]: Role;
	[ComponentType.StringSelect]: string;
	[ComponentType.UserSelect]: User;
};

type SelectMenuValue = SelectMenuValueMap[keyof SelectMenuValueMap];

interface ButtonOptions {
	style: ButtonStyle;
	label: string;
	customId?: string;
	url?: string;
	disabled?: boolean;
}

interface SelectMenuOptions<T extends SelectMenuTypes> {
	customId: string;
	placeholder?: string;
	minValues: number;
	maxValues: number;
	options: Array<{
		label: string;
		value: SelectMenuValue;
		description?: string
	}>;
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

	setSelectMenu<T extends SelectMenuTypes, V extends SelectMenuValueMap[T]>(selectMenu: SelectMenuOptions<T>): this {
		if (this.buttons.length > 0) {
			throw new CommandHandlerError('A row can\'t have both buttons and select menus', 'ActionRow.setSelectMenu');
		}

		if (this.selectMenu) {
			throw new CommandHandlerError('A row can\'t have multiple select menus', 'ActionRow.setSelectMenu');
		}

		if (selectMenu.options.length === 0) {
			throw new CommandHandlerError('Select menu must have at least one option', 'ActionRow.setSelectMenu');
		}

		let selectMenuBuilder;
		const firstOptionValue = selectMenu.options[0].value;

		if (typeof firstOptionValue === 'string') {
			selectMenuBuilder = new StringSelectMenuBuilder();
		} else if (firstOptionValue instanceof Channel) {
			selectMenuBuilder = new ChannelSelectMenuBuilder();
			selectMenuBuilder.setDefaultChannels(selectMenu.options.map(({value}: {
				value: Channel
			}) => value.id));
		} else if (firstOptionValue instanceof Role) {
			selectMenuBuilder = new RoleSelectMenuBuilder();
			selectMenuBuilder.setDefaultRoles(selectMenu.options.map(({value}: {
				value: Role
			}) => value.id));
		} else if (firstOptionValue instanceof User) {
			selectMenuBuilder = new UserSelectMenuBuilder();
			selectMenuBuilder.setDefaultUsers(selectMenu.options.map(({value}: {
				value: User
			}) => value.id));
		} else {
			selectMenuBuilder = new MentionableSelectMenuBuilder();
		}

		selectMenuBuilder
			.setCustomId(selectMenu.customId)
			.setPlaceholder(selectMenu.placeholder ?? '')
			.setMinValues(selectMenu.minValues)
			.setMaxValues(selectMenu.maxValues)
			.addOptions?.(selectMenu.options);

		this.selectMenu = selectMenuBuilder;

		return this;
	}

	toJSON(): APIActionRowComponent<any> {
		const components = [...this.buttons.map(button => button?.toJSON()).filter(Boolean), this.selectMenu?.toJSON()].filter(Boolean);

		return new ActionRowBuilder().addComponents(...(components as AnyComponentBuilder[])).toJSON();
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

	toJSON(): ButtonBuilder {
		const button = new ButtonBuilder().setStyle(this.style).setLabel(this.label).setDisabled(this.disabled);

		if (this.style === ButtonStyle.Link) {
			button.setURL(this.url!);
		} else {
			button.setCustomId(this.customId!);
		}

		return button;
	}
}
