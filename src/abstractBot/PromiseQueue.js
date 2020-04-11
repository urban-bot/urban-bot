export class PromiseQueue {
    constructor() {
        this.last = Promise.resolve();
    }

    next(promise) {
        this.last = this.last.then(promise);
        return this.last;
    }
}
