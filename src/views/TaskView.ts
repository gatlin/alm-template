import { connect } from 'alm';
import * as actions from '../actions';
import TaskComponent from '../components/TaskComponent';

const TaskView = connect(
    _ => { },
    dispatch => ({
        delete_: data => dispatch(actions.delete_(data)),
        toggle: data => dispatch(actions.toggle(data)),
        edit: data => dispatch(actions.edit(data)),
        update: data => dispatch(actions.update(data))
    })
)(TaskComponent);

export default TaskView;
