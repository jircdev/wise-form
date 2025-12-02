export class PendingPromise extends Promise {
    constructor(executor) {
        let resolve;
        let reject;
        // Create a new promise and capture the resolve and reject functions
        super((res, rej) => {
            resolve = res;
            reject = rej;
        });
        // Assign the captured resolve and reject functions to the instance
        this.resolve = resolve;
        this.reject = reject;
        // If an executor is provided, execute it immediately
        if (executor) {
            try {
                executor(this.resolve, this.reject);
            }
            catch (error) {
                this.reject(error);
            }
        }
    }
}
//# sourceMappingURL=pending-promise.js.map