import {type APIActionRowComponent, ButtonStyle, ChannelType} from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	type BaseSelectMenuBuilder,
	ChannelSelectMenuBuilder,
	MentionableSelectMenuBuilder,
	RoleSelectMenuBuilder,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder,
} from 'discord.js';
import {CommandHandlerError} from '../errors/CommandHandlerError.js';
import {Button, type ButtonOptions} from './Button.js';
import type {
	SelectMenuChannelOptions,
	SelectMenuMentionableOptions,
	SelectMenuOptions,
	SelectMenuRoleOptions,
	SelectMenuStringOptions,
	SelectMenuUserOptions,
} from './SelectMenuOption.js';

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

	setStringSelectMenu(options: SelectMenuOptions & SelectMenuStringOptions): this {
		if (!options.options.length) {
			throw new CommandHandlerError('String Select Menu must have at least one option.', 'ActionRow.setStringSelectMenu');
		}

		this.selectMenu = this.configureSelectMenu(new StringSelectMenuBuilder(), options).setOptions(options.options);
		return this;
	}

	setChannelSelectMenu(options: SelectMenuOptions & SelectMenuChannelOptions): this {
		this.selectMenu = this.configureSelectMenu(new ChannelSelectMenuBuilder(), options);

		if (options.channelTypes) {
			this.selectMenu.setChannelTypes(options.channelTypes?.map(type => typeof type === 'string' ? ChannelType[type] : type) ?? []);
		}
		if (options.defaultChannel !== undefined) {
			this.selectMenu.setDefaultChannels(typeof options.defaultChannel === 'string'
			                                   ? options.defaultChannel
			                                   : options.defaultChannel.id);
		}

		return this;
	}

	setRoleSelectMenu(options: SelectMenuOptions & SelectMenuRoleOptions): this {
		this.selectMenu = this.configureSelectMenu(new RoleSelectMenuBuilder(), options);

		if (options.defaultRole !== undefined) {
			this.selectMenu.setDefaultRoles(typeof options.defaultRole === 'string' ? options.defaultRole : options.defaultRole.id);
		}
		return this;
	}

	setUserSelectMenu(options: SelectMenuOptions & SelectMenuUserOptions): this {
		this.selectMenu = this.configureSelectMenu(new UserSelectMenuBuilder(), options);

		if (options.defaultUser !== undefined) {
			this.selectMenu.setDefaultUsers(typeof options.defaultUser === 'string' ? options.defaultUser : options.defaultUser.id);
		}
		return this;
	}

	setMentionableSelectMenu(options: SelectMenuOptions & SelectMenuMentionableOptions): this {
		this.selectMenu = this.configureSelectMenu(new MentionableSelectMenuBuilder(), options);

		if (options.defaultRole !== undefined) {
			this.selectMenu.addDefaultRoles(typeof options.defaultRole === 'string' ? options.defaultRole : options.defaultRole.id);
		}

		if (options.defaultUser !== undefined) {
			this.selectMenu.addDefaultUsers(typeof options.defaultUser === 'string' ? options.defaultUser : options.defaultUser.id);
		}

		return this;
	}

	toJSON(): APIActionRowComponent<any> {
		const components = [
			...this.buttons.map(button => button?.toBuilder()), this.selectMenu,
		].filter(component => component !== undefined);

		return new ActionRowBuilder().addComponents(...components).toJSON();
	}

	private configureSelectMenu<B extends BaseSelectMenuBuilder<any>>(builder: B, options: SelectMenuOptions,
	): B {
		if (this.buttons.length > 0) {
			throw new CommandHandlerError('A row can\'t have both buttons and select menus', 'ActionRow.configureSelectMenu');
		}

		if (this.selectMenu) {
			throw new CommandHandlerError('A row can\'t have multiple select menus', 'ActionRow.configureSelectMenu');
		}

		builder.setCustomId(options.customId);

		if (options.placeholder) builder.setPlaceholder(options.placeholder);
		if (options.minValues) builder.setMinValues(options.minValues);
		if (options.maxValues) builder.setMaxValues(options.maxValues);

		return builder;
	}
}
