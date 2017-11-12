import { el } from '../../lib/alm';

const EditingTask = ({ uid, description, update }) =>
    el('input', {
        'type': 'text',
        'class': 'editing',
        'id': 'edit-task-' + uid,
        'value': description,
        'on': {
            keydown: evt => {
                if (evt.getRaw().keyCode === 13) {
                    let text = evt.getValue();
                    update({ uid, text });
                }
            },
            blur: evt => {
                let text = evt.getValue();
                update({ uid, text });
            }
        }
    });

export default EditingTask;
