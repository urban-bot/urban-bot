export class PromiseQueue {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    last: Promise<any>;

    constructor() {
        this.last = Promise.resolve();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next<T>(callback: (...args: any[]) => T): Promise<T> {
        this.last = this.last.then(callback);
        return this.last;
    }
}
