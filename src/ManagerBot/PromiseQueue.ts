type AnyFunction = (...args: any[]) => any;

export class PromiseQueue {
    last: Promise<any>;

    constructor() {
        this.last = Promise.resolve();
    }

    next(callback: AnyFunction) {
        this.last = this.last.then(callback);
        return this.last;
    }
}
