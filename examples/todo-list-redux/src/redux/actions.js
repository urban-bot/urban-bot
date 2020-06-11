export const addTodo = (text) => ({
    type: 'ADD_TODO',
    text,
});

export const toggleTodo = (id) => ({
    type: 'TOGGLE_TODO',
    id,
});

export const deleteTodo = (id) => ({
    type: 'DELETE_TODO',
    id,
});

export const toggleMode = () => ({
    type: 'TOGGLE_MODE',
});
