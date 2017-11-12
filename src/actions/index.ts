/**
 * @module actions
 * Two sorts of things are exported from here: the {@link Actions} enum and the
 * actual action creators.
 */

export enum Actions {
    Add,
    Delete,
    Complete,
    Editing,
    UpdateTask,
    UpdateField
};

export const add = () => ({
    type: Actions.Add
});

export const delete_ = data => ({
    type: Actions.Delete,
    data
});

export const toggle = data => ({
    type: Actions.Complete,
    data
});

export const edit = data => ({
    type: Actions.Editing,
    data
});

export const update = data => ({
    type: Actions.UpdateTask,
    data
});

export const updateField = data => ({
    type: Actions.UpdateField,
    data
});
