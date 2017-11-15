import * as Alm from 'alm';
const jsx = Alm.jsx;

export const ViewingTask = ({ uid, completed, description, edit }) => (
    <label
      className={ completed ? 'completed' : 'task_text' }
      id={'text-task-'+uid}
      on={{
          dblclick: evt => edit(uid)
      }} >
      { description }
    </label>
);

export default ViewingTask;
