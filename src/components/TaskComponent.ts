import { el } from '../../lib/alm';
import EditingTask from './EditingTask';
import ViewingTask from './ViewingTask';

const TaskComponent = props => {
    const { uid, description, completed, edit, update } = props;
    const content = props.editing
        ? EditingTask({ uid, description, update })
        : ViewingTask({ uid, description, completed, edit });

    const checkboxAttrs = {
        'type': 'checkbox',
        'class': 'toggle',
        'id': 'check-task-' + uid,
        'on': {
            change: evt => props.toggle(uid)
        }
    };

    if (completed) {
        checkboxAttrs['checked'] = 'checked';
    }

    const children = [
        el('input', checkboxAttrs),
        content,
        el('button', {
            'class': 'delete_button',
            'id': 'del-task-' + props.uid,
            'on': {
                click: evt => props.delete_(uid)
            }
        })
    ];

    return el('li', {
        'id': 'task-' + uid,
        'class': 'task'
    }, children);
};

export default TaskComponent;
