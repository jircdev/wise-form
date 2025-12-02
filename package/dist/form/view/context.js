import React from 'react';
const value = {};
export const WiseFormContext = React.createContext(value);
export const useWiseFormContext = () => React.useContext(WiseFormContext);
export const WrappedWiseFormContext = React.createContext(value);
export const useWrappedWiseFormContext = () => React.useContext(WrappedWiseFormContext);
//# sourceMappingURL=context.js.map