import { el } from '../../lib/alm';

const ViewingTask = ({ uid, completed, description, edit }) =>
    el('label', {
        'class': completed ? 'completed' : 'task_text',
        'id': 'text-task-' + uid,
        'on': {
            dblclick: evt => edit(uid)
        }
    }, [description]);

export default ViewingTask;
