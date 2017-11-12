/**
 * @module reducer
 * The state reducer function.
 */

import { Actions } from '../actions';

const reducer = (state, action) => {
    switch (action.type) {
        case Actions.UpdateField:
            return { ...state, field: action.data };
        case Actions.Add:
            return add(state);
        case Actions.Delete:
            return delete_(state, action.data);
        case Actions.Complete:
            return complete(state, action.data);
        case Actions.Editing:
            return edit(state, action.data);
        case Actions.UpdateTask:
            return updateTask(state, action.data);
        default:
            return state;
    }
};

const add = ({ field, tasks, uid }) => {
    if (field.trim() === '') {
        return { field, tasks, uid };
    }

    const task = {
        completed: false,
        editing: false,
        description: field,
        uid
    };

    return {
        tasks: [...tasks, task],
        uid: uid + 1,
        field: ''
    };
};

const delete_ = ({ tasks, uid, field }, taskUid) => {
    let idx = -1;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].uid === taskUid) {
            idx = i;
            break;
        }
    }
    if (idx > -1) {
        tasks.splice(idx, 1);
    }
    return { tasks, uid, field };
};

const complete = ({ tasks, field, uid }, taskUid) => {
    for (let i = tasks.length; i--;) {
        if (tasks[i].uid === taskUid) {
            tasks[i].completed =
                !tasks[i].completed;
            break;
        }
    }
    return { tasks, field, uid };
};

const edit = ({ tasks, field, uid }, taskUid) => {
    for (let i = tasks.length; i--;) {
        if (tasks[i].uid === taskUid) {
            tasks[i].editing = true;
            break;
        }
    }
    return { tasks, field, uid };
};

const updateTask = ({ tasks, field, uid }, { taskUid, text }) => {
    for (let i = tasks.length; i--;) {
        if (tasks[i].uid === taskUid) {
            tasks[i].editing = false;
            tasks[i].description = text;
            break;
        }
    }
    return { tasks, field, uid };
};

export default reducer;
