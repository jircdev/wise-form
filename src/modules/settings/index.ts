export /*bundle*/ class RFSettings {
	#types: Record<string, any> = {};
	get types() {
		return this.#types;
	}
	setFields(specs) {
		this.#types = { ...this.#types, ...specs };
	}
}

export /*bundle */ const WFSettings = new RFSettings();
