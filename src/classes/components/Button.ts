import {ButtonStyle} from 'discord-api-types/v10';
import {ButtonBuilder} from 'discord.js';

export interface ButtonOptions {
	customId?: string;
	disabled?: boolean;
	label: string;
	style: ButtonStyle | keyof typeof ButtonStyle;
	url?: string;
}

export class Button {
	constructor(
		private style: ButtonStyle,
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

		button.setStyle(this.style);

		if (this.style === ButtonStyle.Link) {
			button.setURL(this.url!);
		} else {
			button.setCustomId(this.customId!);
		}

		return button;
	}
}
