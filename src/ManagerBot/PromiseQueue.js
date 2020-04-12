export class PromiseQueue {
    constructor() {
        this.last = Promise.resolve();
    }

    next(callback) {
        this.last = this.last.then(callback);
        return this.last;
    }
}
