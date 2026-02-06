/**
 * Maximum number of recursive executions allowed for a callback before preventing further execution.
 * This can be overridden if specific use cases require a higher limit.
 */
export declare const MAX_CALLBACK_RECURSION_DEPTH = 3;
export declare class CallbackManager {
    #private;
    constructor(model: any, field: any);
    initialize(): void;
    executeCallback: (settings: any) => Promise<void>;
}
//# sourceMappingURL=callback-manager.d.ts.map