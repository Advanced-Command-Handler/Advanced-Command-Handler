import {
	ActionRowBuilder,
	BaseSelectMenuBuilder,
	ChannelSelectMenuBuilder,
	MentionableSelectMenuBuilder,
	RoleSelectMenuBuilder,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder,
} from '@discordjs/builders';
import {type APIActionRowComponent, ButtonStyle, ChannelType, ComponentType} from 'discord-api-types/v9';
import {Channel, Role, User} from 'discord.js';
import {CommandHandlerError} from '../errors/CommandHandlerError.js';
import {Button, type ButtonOptions} from './Button.js';
import type {SelectMenuChannelOptions, SelectMenuOptions, SelectMenuValueMap} from './SelectMenuOption.js';

export class ActionRow {
	private buttons: (Button | undefined)[] = [];
	private selectMenu: | RoleSelectMenuBuilder | ChannelSelectMenuBuilder | MentionableSelectMenuBuilder | UserSelectMenuBuilder | StringSelectMenuBuilder | undefined = undefined;

	addButton(options: ButtonOptions): this {
		if (this.buttons.length >= 5) {
			throw new CommandHandlerError('A row can have a maximum of 5 components', 'ActionRow.addButton');
		}
		const button = new Button(options.style in ButtonStyle
		                          ? ButtonStyle[options.style as keyof typeof ButtonStyle]
		                          : options.style as ButtonStyle, options.label, options.customId, options.url, options.disabled ?? false);
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
