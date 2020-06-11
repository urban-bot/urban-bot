import React from 'react';
import { useText, Button, ButtonGroup, Text } from '@urban-bot/core';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import { addTodo, deleteTodo, toggleTodo } from './redux/actions';

const DELETE_TODOS_MODE = 'DELETE_TODOS_MODE';
const COMPLETE_TODOS_MODE = 'COMPLETE_TODOS_MODE';

function TodoList() {
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos);
    const [mode, setMode] = React.useState(COMPLETE_TODOS_MODE);

    function clickTodo(id) {
        if (mode === DELETE_TODOS_MODE) {
            dispatch(deleteTodo(id));
        } else {
            dispatch(toggleTodo(id));
        }
    }

    function toggleMode() {
        setMode(mode === DELETE_TODOS_MODE ? COMPLETE_TODOS_MODE : DELETE_TODOS_MODE);
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

    const modeButton = (
        <Button key={mode} onClick={toggleMode}>
            {mode === DELETE_TODOS_MODE ? 'Delete mode' : 'Toggle mode'}
        </Button>
    );

    const todosButtons = todos.map(({ text, id }) => (
        <Button key={id} onClick={() => clickTodo(id)}>
            {text}
        </Button>
    ));

    return (
        <ButtonGroup title={title} maxColumns={3}>
            {[modeButton, ...todosButtons]}
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
