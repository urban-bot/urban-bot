import { combineReducers } from 'redux';

export const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: Math.random(),
                    text: action.text,
                    isCompleted: false,
                },
            ];
        case 'TOGGLE_TODO':
            return state.map((todo) => (todo.id === action.id ? { ...todo, isCompleted: !todo.isCompleted } : todo));
        case 'DELETE_TODO':
            return state.filter((todo) => todo.id !== action.id);
        default:
            return state;
    }
};

export const rootReducer = combineReducers({
    todos,
});
