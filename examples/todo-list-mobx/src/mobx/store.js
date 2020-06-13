import { TodoList } from './TodoList';
import { Mode } from './Mode';

export const store = {
    todoList: new TodoList(),
    mode: new Mode(),
};
