import {ActionRow} from './ActionRow.js';

export class ComponentsBuilder {
	private rows: ActionRow[] = [];

	addRow(callback: (row: ActionRow) => void): this {
		const row = new ActionRow();
		callback(row);
		this.rows.push(row);
		return this;
	}

	toJSON() {
		return this.rows.map(row => row.toJSON());
	}
}
