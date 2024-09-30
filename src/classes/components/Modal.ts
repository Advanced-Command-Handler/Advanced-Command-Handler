import {TextInputStyle} from 'discord-api-types/v10';
import {ActionRowBuilder, type ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder} from 'discord.js';

interface TextInputOptions {
	customId: string;
	label: string;
	style?: TextInputStyle;
	placeholder?: string;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
}

export class ModalComponent {
	public components: TextInputBuilder[] = [];

	constructor(public customId: string, public title: string) {
	}

	addTextInput(options: TextInputOptions): this {
		const style = options.style ?? TextInputStyle.Short;
		const required = options.required ?? false;
		const textInput = new TextInputBuilder()
			.setCustomId(options.customId)
			.setLabel(options.label)
			.setStyle(style)
			.setRequired(required);

		if (options.placeholder) textInput.setPlaceholder(options.placeholder);
		if (options.minLength) textInput.setMinLength(options.minLength);
		if (options.maxLength) textInput.setMaxLength(options.maxLength);

		this.components.push(textInput);
		return this;
	}

	toBuilder() {
		const modal = new ModalBuilder().setCustomId(this.customId).setTitle(this.title);
		modal.addComponents(...this.components.map(component => new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			component)));
		return modal;
	}
}
