// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import * as actions from '../actions';
import GroupJoinComponent from '../components/GroupJoinComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


const mapStateToProps = state => ({
  groupIdFieldValue: state.group.groupIdFieldValue,
  groupJoinValidationState: state.group.groupJoinValidationState,
  isJoinButtonDisabled: state.group.groupJoinValidationState !== 'success',
  joinGroup: () => utils.addUserToGroup(state.group.groupIdFieldValue),
});


export const _handleChange = async (dispatch, e) => {
  const groupId = e.target.value;
  // Sync value in state with value in form field
  dispatch(actions.saveGroupIdFieldValue(groupId));
  // If input is empty, turn off validation
  if (!groupId) {
    dispatch(actions.saveGroupJoinValidationState(null));
    return;
  }
  // Validate that input is an existing group ID
  const groupRef = firebase.database().ref(`${constants.DB_PATH_LUMI_GROUPS}/${groupId}`);
  const groupSnapshot = await groupRef.once(constants.DB_EVENT_NAME_VALUE);
  dispatch(actions.saveGroupJoinValidationState(groupSnapshot.val() ? 'success' : 'error'));
};


const mapDispatchToProps = dispatch => ({
  handleChange: e => _handleChange(dispatch, e),
});


const GroupJoinContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupJoinComponent);

export default GroupJoinContainer;
