import React from 'react';
import { useText, Button, ButtonGroup, Text } from '@urban-bot/core';
import { Provider, useDispatch, useSelector } from 'react-redux/lib/alternate-renderers';
import { store } from './redux/store';
import { addTodo, deleteTodo, toggleMode, toggleTodo } from './redux/actions';
import { DELETE_TODOS_MODE } from './redux/constants';

function TodoList() {
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos);
    const mode = useSelector((state) => state.mode);

    function clickTodo(id) {
        if (mode === DELETE_TODOS_MODE) {
            dispatch(deleteTodo(id));
        } else {
            dispatch(toggleTodo(id));
        }
    }

    useText(({ text }) => {
        dispatch(addTodo(text));
    });

    if (todos.length === 0) {
        return <Text>Todo list is empty</Text>;
    }

    const title = todos.map((todo) => (
        <>
            {todo.isCompleted ? <s>{todo.text}</s> : todo.text}
            <br />
        </>
    ));

    const todosButtons = todos.map(({ text, id }) => (
        <Button key={id} onClick={() => clickTodo(id)}>
            {text}
        </Button>
    ));

    return (
        <ButtonGroup title={title} maxColumns={3}>
            <Button key={mode} onClick={() => dispatch(toggleMode())}>
                {mode === DELETE_TODOS_MODE ? 'Delete mode' : 'Toggle mode'}
            </Button>
            {todosButtons}
        </ButtonGroup>
    );
}

export function App() {
    return (
        <Provider store={store}>
            <Text>Welcome to todo list. Type your new todo.</Text>
            <TodoList />
        </Provider>
    );
}
