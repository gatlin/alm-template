/**
 * @module store
 * The state types as well as the initial application state.
 */

export type Task = {
    description: string;
    completed: boolean;
    editing: boolean;
    uid: number;
};

export type State = {
    tasks: Array<Task>;
    field: string;
    uid: number;
}

export const initialState: State = {
    tasks: [],
    field: '',
    uid: 0
};
