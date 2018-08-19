/**
 * @module reducer
 * Each reducer module defines / should define its own State type, initial
 * state, and reducer function. This is the place to combine them all into one.
 */

import { makeReducer } from 'alm';
import { taskReducer, TaskState, taskState } from './tasks';

export type State = {
    task: TaskState
};

export const initialState = {
    task: taskState
};

export const reducer = makeReducer({
    task: taskReducer
});
