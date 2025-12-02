var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _PluginsManager_plugins, _PluginsManager_instances, _PluginsManager_model;
import { ReactiveModel } from '@beyond-js/reactive/model';
import { PLUGINS } from './plugins';
export class PluginsManager extends ReactiveModel {
    get instances() {
        return __classPrivateFieldGet(this, _PluginsManager_instances, "f");
    }
    ;
    constructor(model) {
        super();
        _PluginsManager_plugins.set(this, ['formula']);
        _PluginsManager_instances.set(this, new Map());
        _PluginsManager_model.set(this, void 0);
        __classPrivateFieldSet(this, _PluginsManager_model, model, "f");
        globalThis.f = model;
        this.initialize();
    }
    async initialize() {
        const plugins = Object.keys(PLUGINS);
        const promises = [];
        plugins.forEach(plugin => {
            const manager = PLUGINS[plugin].object;
            const instance = manager.settings(__classPrivateFieldGet(this, _PluginsManager_model, "f"));
            promises.push(instance);
        });
        const results = await Promise.allSettled(promises);
        const installed = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
        const failed = results.filter(result => result.status === 'rejected');
        if (failed.length) {
            console.warn('Failed to install plugins', failed);
        }
        installed.forEach((plugin) => __classPrivateFieldGet(this, _PluginsManager_instances, "f").set(plugin.name, plugin));
        this.ready = true;
    }
}
_PluginsManager_plugins = new WeakMap(), _PluginsManager_instances = new WeakMap(), _PluginsManager_model = new WeakMap();
PluginsManager.items = new Map();
PluginsManager.formulas = {};
//# sourceMappingURL=index.js.map