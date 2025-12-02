export class PendingPromise<T> extends Promise<T> {
	public resolve!: (value: T | PromiseLike<T>) => void;
	public reject!: (reason?: any) => void;

	constructor(executor?: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
		let resolve: (value: T | PromiseLike<T>) => void;
		let reject: (reason?: any) => void;

		// Create a new promise and capture the resolve and reject functions
		super((res, rej) => {
			resolve = res;
			reject = rej;
		});

		// Assign the captured resolve and reject functions to the instance
		this.resolve = resolve!;
		this.reject = reject!;

		// If an executor is provided, execute it immediately
		if (executor) {
			try {
				executor(this.resolve, this.reject);
			} catch (error) {
				this.reject(error);
			}
		}
	}
}

