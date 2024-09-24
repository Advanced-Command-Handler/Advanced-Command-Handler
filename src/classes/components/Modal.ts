import {MessageActionRow, Modal, type ModalActionRowComponent, TextInputComponent, type TextInputStyleResolvable} from 'discord.js';

interface TextInputOptions {
	customId: string;
	label: string;
	style?: TextInputStyleResolvable;
	placeholder?: string;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
}

export class ModalComponent {
	private components: TextInputComponent[] = [];

	constructor(
		private customId: string,
		private title: string
	) {}

	addTextInput(options: TextInputOptions): this {
		const style = options.style ?? 'SHORT';
		const required = options.required ?? false;
		const textInput = new TextInputComponent().setCustomId(options.customId).setLabel(options.label).setStyle(style).setRequired(
			required);

		if (options.placeholder) textInput.setPlaceholder(options.placeholder);
		if (options.minLength) textInput.setMinLength(options.minLength);
		if (options.maxLength) textInput.setMaxLength(options.maxLength);

		this.components.push(textInput);
		return this;
	}

	toBuilder(): Modal {
		const modal = new Modal().setCustomId(this.customId).setTitle(this.title);
		modal.addComponents(...this.components.map(component => new MessageActionRow<ModalActionRowComponent>().addComponents(component)));
		return modal;
	}
}
