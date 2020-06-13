import { observable, action } from 'mobx';

export const DELETE_TODOS_MODE = 'DELETE_TODOS_MODE';
export const COMPLETE_TODOS_MODE = 'COMPLETE_TODOS_MODE';

export class Mode {
    @observable mode = COMPLETE_TODOS_MODE;

    @action
    toggle() {
        this.mode = this.mode === DELETE_TODOS_MODE ? COMPLETE_TODOS_MODE : DELETE_TODOS_MODE;
    }
}
