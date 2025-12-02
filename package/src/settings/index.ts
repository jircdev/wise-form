export class RFSettings {
	#types: Record<string, any> = {};
	get types() {
		return this.#types;
	}
	setFields(specs) {
		this.#types = { ...this.#types, ...specs };
	}
}

export const WFSettings = new RFSettings();
