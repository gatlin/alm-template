import * as Alm from 'alm';
import TaskView from '../views/TaskView';

import './MainComponent.css';

/**
 * The main application component. Self-explanatory.
 */
const MainComponent = props => (
    <section
        id="the_app"
        className="app">
        <header
            id="header"
            className="header">
            <h1 key="title">
                Obligatory Todo App
        </h1>
            <p>Double-click tasks to edit them</p>
        </header>
        <input
            type="text"
            id="field"
            placeholder="What needs to be done?"
            on={{
                keydown: evt => {
                    if (evt.getRaw().keyCode === 13) {
                        props.add();
                    }
                },
                input: evt => props.updateField(evt.getValue())
            }}
            value={props.field}
        ></input>
        <ul
            className="todo_list"
            id="todo_list"
          >
          {props.tasks.map(TaskView)}
        </ul>
    </section>
);

export default MainComponent;
