import React from 'react';
export function ErrorRenderer({ error }) {
    React.useEffect(() => {
        console.error(error);
    }, []);
    return React.createElement("div", { className: 'alert alert--error pui-alert' }, error);
}
//# sourceMappingURL=error.js.map