import * as Alm from 'alm';

// How a task is presented when not editing it
const ViewingTask = ({ uid, completed, description, edit }) => (
    <label
      className={ completed ? 'completed' : 'task_text' }
      id={'text-task-' + uid }
      on={{
          dblclick: evt => edit(uid)
      }}
      >
      { description }
    </label>
);

// How a task is presented when editing it
const EditingTask = ({ uid, description, update }) => (
    <input
      type='text'
      className='editing'
      id={'edit-task-' + uid }
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
      }}
      >
    </input>
);

const TaskComponent = props => {
    const { uid, description, completed, edit, update } = props;
    const content = props.editing
        ? EditingTask({ uid, description, update })
        : ViewingTask({ uid, description, completed, edit });

    return (
        <li id={'task-' + uid} className='task'>
            <input
              type='checkbox'
              className='toggle'
              id={'check-task-' + uid}
              on={{
                  change: evt => props.toggle(uid)
              }}
              checked={completed ? 'checked' : null}
            ></input>
            {content}
            <button
                className='delete_button'
                id={'del-task-' + props.uid}
                on={{
                    click: evt => props.delete_(uid)
              }}>
            </button>
        </li>
    );
};

export default TaskComponent;
