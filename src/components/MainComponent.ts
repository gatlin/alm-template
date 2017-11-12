import { el } from '../../lib/alm';
import TaskView from '../views/TaskView';

/**
 * The main application component. Self-explanatory.
 */
const MainComponent = props =>
    el('section', { 'id': 'the_app', 'class': 'app' }, [
        el('header', { 'id': 'header', 'class': 'header' }, [
            el('h1', { key: 'title' }, ['Obligatory Todo App']),
            el('p', { key: 'wut' }, ['Double-click tasks to edit them'])
        ]),
        el('input', {
            'type': 'text',
            'id': 'field',
            'placeholder': 'What needs to be done?',
            'on': {
                'keydown': evt => {
                    if (evt.getRaw().keyCode === 13) {
                        props.add();
                    }
                },
                'input': evt => props.updateField(evt.getValue())
            },
            'value': props.field
        }, ['']),
        el('ul', {
            'class': 'todo_list',
            'id': 'todo_list'
        }, props.tasks.map(task => TaskView(task)))
    ]);

export default MainComponent;
