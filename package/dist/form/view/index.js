import React from 'react';
import { useModel } from './hooks/use-model';
import { WiseFormContext } from './context';
import { useTypes } from './hooks/use-types';
import { Containers } from './components/containers';
export function WiseForm({ children, settings, types, model }) {
    const { ready, model: instance, type, styles, items } = useModel(settings, model);
    const formTypes = useTypes(types);
    if (!ready)
        return null;
    if (!settings && !model) {
        console.error('the form does not have settings or model defined', settings);
    }
    const onSubmit = (event) => {
        event.preventDefault();
        // Form submission can be handled via callbacks or custom handlers
        if (instance.callbacks?.onSubmit) {
            instance.callbacks.onSubmit({ form: instance, event });
        }
    };
    const value = {
        model: instance,
        items,
        rows: items,
        values: instance.values,
        name: instance.name,
        template: { type, styles, items },
        formTypes,
    };
    return (React.createElement(WiseFormContext.Provider, { value: value },
        React.createElement("form", { onKeyDown: (e) => {
                if (e.key === 'Enter')
                    e.preventDefault();
            }, className: "reactive-form-container", onSubmit: onSubmit },
            React.createElement(Containers, null),
            children)));
}
//# sourceMappingURL=index.js.map