import React, { useState } from 'react';
import { useText, Button, ButtonGroup, Text } from '@urban-bot/core';

const DELETE_TODOS_MODE = 'DELETE_TODOS_MODE';
const COMPLETE_TODOS_MODE = 'COMPLETE_TODOS_MODE';

function TodoList() {
    const [mode, setMode] = React.useState(COMPLETE_TODOS_MODE);
    const [todos, setTodos] = useState([]);

    function addTodo(text) {
        const newTodo = { text, id: Math.random(), isCompleted: false };

        setTodos([...todos, newTodo]);
    }

    function deleteTodo(deletedId) {
        const newTodos = todos.filter(({ id }) => id !== deletedId);

        setTodos(newTodos);
    }

    function toggleTodo(toggledId) {
        const newTodos = todos.map((todo) => {
            if (todo.id === toggledId) {
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted,
                };
            }

            return todo;
        });

        setTodos(newTodos);
    }

    function toggleMode() {
        setMode(mode === DELETE_TODOS_MODE ? COMPLETE_TODOS_MODE : DELETE_TODOS_MODE);
    }

    function clickTodo(id) {
        if (mode === DELETE_TODOS_MODE) {
            deleteTodo(id);
        } else {
            toggleTodo(id);
        }
    }

    useText(({ text }) => {
        addTodo(text);
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
            <Button key={mode} onClick={toggleMode}>
                {mode === DELETE_TODOS_MODE ? 'Delete mode' : 'Complete mode'}
            </Button>
            {todosButtons}
        </ButtonGroup>
    );
}

export function App() {
    return (
        <>
            <Text>Welcome to todo list. Type your new todo.</Text>
            <TodoList />
        </>
    );
}
