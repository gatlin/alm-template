import { Alm } from 'alm';

import { Actions } from './actions';
import MainComponent from './components/MainComponent';
import { reducer, State, initialState } from './reducer';

// The actual application.
const app = new Alm({
    model: initialState,
    update: reducer,
    view: MainComponent(),
    domRoot: 'main',
    eventRoot: 'main'
});

// Programatically set the document title
document.title = 'Todo List';

// Listen for state updates so we can update the store.
app.store.subscribe(() => {
    const st = app.store.getState();
    if (!st.tasks) {
        document.title = 'Todo List';
        return;
    }
    const num_tasks = app.store.getState().tasks
        .filter(({ completed }) => !completed)
        .length;
    document.title = num_tasks === 0
        ? 'Todo List'
        : '(' + num_tasks + ') Todo List';

});

// And we're off
app.start();
