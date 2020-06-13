import { action, observable } from 'mobx';
import Todo from './Todo';

export class TodoList {
    @observable.shallow todos = [];

    constructor(todos = []) {
        todos.forEach(this.addTodo);
    }

    @action
    addTodo(text) {
        this.todos.push(new Todo(text));
    }

    @action
    deleteTodo(deletedTodo) {
        this.todos.splice(this.todos.indexOf(deletedTodo), 1);
    }
}
