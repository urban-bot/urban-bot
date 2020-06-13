import { action, observable } from 'mobx';

export default class Todo {
    id = Math.random();

    @observable text = '';
    @observable isCompleted = false;

    constructor(text) {
        this.text = text;
    }

    @action
    toggle() {
        this.isCompleted = !this.isCompleted;
    }
}
