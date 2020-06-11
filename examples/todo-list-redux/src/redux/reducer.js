import { combineReducers } from 'redux';
import { COMPLETE_TODOS_MODE, DELETE_TODOS_MODE } from './constants';

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

export const mode = (state = COMPLETE_TODOS_MODE, action) => {
    switch (action.type) {
        case 'TOGGLE_MODE': {
            return state === DELETE_TODOS_MODE ? COMPLETE_TODOS_MODE : DELETE_TODOS_MODE;
        }

        default:
            return state;
    }
};

export const rootReducer = combineReducers({
    todos,
    mode,
});
