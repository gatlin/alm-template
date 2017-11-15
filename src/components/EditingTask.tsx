import * as Alm from 'alm';
const jsx = Alm.jsx;

const EditingTask = ({ uid, description, update }) => (
    <input
        type='text'
        className='editing'
        id={'edit-task-' + uid}
        value={description}
        on={{
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
        }}>
    </input>
);

export default EditingTask;
