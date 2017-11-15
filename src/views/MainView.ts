import { connect } from 'alm';
import * as actions from '../actions';
import MainComponent from '../components/MainComponent';

const MainView = connect(
    state => state,
    dispatch => ({
        add: () => dispatch(actions.add()),
        updateField: data => dispatch(actions.updateField(data))
    })
)(MainComponent);

export default MainView;
