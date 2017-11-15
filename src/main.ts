import { Alm } from 'alm';

import { State, initialState } from './store';
import { Actions } from './actions';
import MainView from './views/MainView';
import reducer from './reducer';

// The actual application.
const app = new Alm<State, Actions>({
    model: initialState,
    update: reducer,
    view: MainView(),
    domRoot: 'main',
    eventRoot: 'main'
});

// Programatically set the document title
document.title = 'Todo List';

// Listen for state updates so we can update the store.
app.store.subscribe(() => {
    const num_tasks = app.store.getState().tasks
        .filter(({ completed }) => !completed)
        .length;
    document.title = num_tasks === 0
        ? 'Todo List'
        : '(' + num_tasks + ') Todo List';
});

// And we're off
app.start();
