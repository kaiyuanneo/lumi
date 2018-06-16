// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import * as actions from '../actions';
import GroupAddCreateComponent from '../components/GroupAddCreateComponent';
import * as constants from '../static/constants';
import * as baseUtils from '../utils/baseUtils';


// Group name is invalid if both first name and last name are empty
export const _getGroupCreateValidationState = (state) => {
  if (
    state.group.groupFirstNameFieldValue === '' &&
    state.group.groupLastNameFieldValue === ''
  ) {
    return null;
  }
  return 'success';
};


const mapStateToProps = state => ({
  firstNameFieldValue: state.group.groupFirstNameFieldValue,
  lastNameFieldValue: state.group.groupLastNameFieldValue,
  groupCreateValidationState: _getGroupCreateValidationState(state),
  isCreateButtonDisabled: _getGroupCreateValidationState(state) !== 'success',
});


const mapDispatchToProps = dispatch => ({
  saveCareProfileFirstName: e => dispatch(actions.saveGroupFirstNameFieldValue(e.target.value)),
  saveCareProfileLastName: e => dispatch(actions.saveGroupLastNameFieldValue(e.target.value)),
  clearGroupFirstLastNameFieldValues: () => {
    dispatch(actions.saveGroupFirstNameFieldValue(''));
    dispatch(actions.saveGroupLastNameFieldValue(''));
  },
  clearGroupAddState:
    () => dispatch(actions.saveGroupAddState(constants.GROUP_ADD_STATE_CREATE_OR_JOIN)),
  goToTimeline: () => dispatch(actions.saveCurrentProductCode(constants.PRODUCT_CODE_TIMELINE)),
});


export const _createGroup = async (stateProps) => {
  const db = firebase.database();
  // Save care recipient info in user path as a new user and use an auto-generated key as user ID.
  // If this person has an email on record and ever signs in with that email, AuthComponent will
  // merge this and the person's Facebook profile data.
  const careRecipientRef = await db.ref(constants.DB_PATH_USERS).push({
    firstName: stateProps.firstNameFieldValue,
    lastName: stateProps.lastNameFieldValue,
  });
  // Create group record in lumi-groups
  const newGroupRef = await db.ref(constants.DB_PATH_LUMI_GROUPS).push({
    name: `${stateProps.firstNameFieldValue} ${stateProps.lastNameFieldValue}`,
    activeCareRecipient: careRecipientRef.key,
  });
  // Add auth user to new group
  await baseUtils.addUserToGroup(newGroupRef.key);
  // Add new care recipient to new group and set as active care recipient
  await baseUtils.addUserToGroup(newGroupRef.key, careRecipientRef.key);
};


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  createGroup: async () => {
    await _createGroup(stateProps);
    dispatchProps.clearGroupFirstLastNameFieldValues();
    dispatchProps.clearGroupAddState();
    dispatchProps.goToTimeline();
  },
});


const GroupAddCreateContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(GroupAddCreateComponent);

export default GroupAddCreateContainer;
