import { ReactiveModel } from '@beyond-js/reactive/model';
import type { FormModel } from '../model';
import { PLUGINS } from './plugins';
import { IPluginForm } from '../types/plugins';
export class PluginsManager extends ReactiveModel<PluginsManager> {
	#plugins: Record<string, any> = ['formula'];

	private static items: Map<string, any> = new Map();
	#instances = new Map<string, IPluginForm>();
	get instances() {
		return this.#instances;
	};
	static formulas: Record<string, any> = {};
	#model: FormModel;
	constructor(model) {
		super();
		this.#model = model;

		globalThis.f = model;
		this.initialize();
	}

	private async initialize() {
		const plugins = Object.keys(PLUGINS);
		const promises: Promise<IPluginForm>[] = [];

		plugins.forEach(plugin => {
			const manager = PLUGINS[plugin].object;
			const instance = manager.settings(this.#model);
			promises.push(instance);
		});

		const results = await Promise.allSettled(promises);

		const installed = results
			.filter(result => result.status === 'fulfilled')
			.map(result => (result as PromiseFulfilledResult<any>).value);

		const failed = results.filter(result => result.status === 'rejected');
		if (failed.length) {
			console.warn('Failed to install plugins', failed);
		}
		installed.forEach((plugin: IPluginForm) => this.#instances.set(plugin.name, plugin));

		this.ready = true;
	}
}
