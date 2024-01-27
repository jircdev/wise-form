export /*bundle*/ class RFSettings {
	#types: Record<string, any> = {};
	get types() {
		return this.#types;
	}
	setFields(specs) {}
}

export /*bundle */ const Settings = new RFSettings();
