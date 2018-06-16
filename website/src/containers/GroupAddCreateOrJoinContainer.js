// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';

import * as actions from '../actions';
import GroupAddCreateOrJoinComponent from '../components/GroupAddCreateOrJoinComponent';
import * as constants from '../static/constants';


const mapDispatchToProps = dispatch => ({
  navigateToGroupAddCreate:
    () => dispatch(actions.saveGroupAddState(constants.GROUP_ADD_STATE_CREATE)),
  navigateToGroupAddJoin:
    () => dispatch(actions.saveGroupAddState(constants.GROUP_ADD_STATE_JOIN)),
});


const GroupAddCreateOrJoinContainer = connect(
  null,
  mapDispatchToProps,
)(GroupAddCreateOrJoinComponent);

export default GroupAddCreateOrJoinContainer;
