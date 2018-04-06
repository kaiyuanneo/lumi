// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import * as actions from '../actions';
import GroupCreateComponent from '../components/GroupCreateComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


export const _createGroup = (state) => {
  // Create group record in lumi-groups and add user to the group
  const newGroupRef = firebase.database().ref(constants.DB_PATH_LUMI_GROUPS).push({
    name: state.group.groupNameFieldValue,
  });
  utils.addUserToGroup(newGroupRef.key);
};


const mapStateToProps = state => ({
  groupCreateValidationState: state.group.groupCreateValidationState,
  groupNameFieldValue: state.group.groupNameFieldValue,
  isCreateButtonDisabled: state.group.groupCreateValidationState !== 'success',
  createGroup: () => _createGroup(state),
});


const mapDispatchToProps = dispatch => ({
  handleChange: e => dispatch(actions.saveGroupNameFieldValue(e.target.value)),
});


const GroupCreateContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupCreateComponent);

export default GroupCreateContainer;
