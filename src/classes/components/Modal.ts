/* import {ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle} from '@discordjs/builders';

export class ModalComponent {
	private components: TextInputBuilder[] = [];

	constructor(
		private customId: string,
		private title: string
	) {}

	addTextInput(
		customId: string,
		label: string,
		style: TextInputStyle,
		placeholder?: string,
		required: boolean = false,
		minLength?: number,
		maxLength?: number
	): this {
		const textInput = new TextInputBuilder().setCustomId(customId).setLabel(label).setStyle(style).setRequired(required);

		if (placeholder) textInput.setPlaceholder(placeholder);
		if (minLength) textInput.setMinLength(minLength);
		if (maxLength) textInput.setMaxLength(maxLength);

		this.components.push(textInput);
		return this;
	}

	toJSON(): ModalBuilder {
		const modal = new ModalBuilder().setCustomId(this.customId).setTitle(this.title);

		this.components.forEach(component => {
			modal.addComponents(new ActionRowBuilder().addComponents(component));
		});

		return modal;
	}
}
 */
