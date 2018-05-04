// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import * as actions from '../actions';
import GroupCreateComponent from '../components/GroupCreateComponent';
import * as constants from '../static/constants';
import * as baseUtils from '../utils/baseUtils';


export const _createGroup = async (state) => {
  const db = firebase.database();
  // Save care recipient info in user path as a new user and use an auto-generated key as user ID.
  // If this person has an email on record and ever signs in with that email, AuthComponent will
  // merge this and the person's Facebook profile data.
  const careRecipientRef = await db.ref(constants.DB_PATH_USERS).push({
    firstName: state.careProfile.firstNameFormFieldValue,
    lastName: state.careProfile.lastNameFormFieldValue,
  });
  // Create group record in lumi-groups
  const newGroupRef = await db.ref(constants.DB_PATH_LUMI_GROUPS).push({
    name: `${state.careProfile.firstNameFormFieldValue} ${state.careProfile.lastNameFormFieldValue}`,
    activeCareRecipient: careRecipientRef.key,
  });
  // Add auth user to new group
  await baseUtils.addUserToGroup(newGroupRef.key);
  // Add new care recipient to new group and set as active care recipient
  await baseUtils.addUserToGroup(newGroupRef.key, careRecipientRef.key);
};


// Group name is invalid if both first name and last name are empty
export const _getGroupCreateValidationState = (state) => {
  if (
    state.careProfile.firstNameFormFieldValue === '' &&
    state.careProfile.lastNameFormFieldValue === ''
  ) {
    return null;
  }
  return 'success';
};


const mapStateToProps = state => ({
  firstNameFieldValue: state.careProfile.firstNameFormFieldValue,
  lastNameFieldValue: state.careProfile.lastNameFormFieldValue,
  groupCreateValidationState: _getGroupCreateValidationState(state),
  isCreateButtonDisabled: _getGroupCreateValidationState(state) !== 'success',
  createGroup: () => _createGroup(state),
});


const mapDispatchToProps = dispatch => ({
  saveCareProfileFirstName: e => dispatch(actions.saveCareProfileFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_FIRST_NAME, e.target.value)),
  saveCareProfileLastName: e => dispatch(actions.saveCareProfileFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_LAST_NAME, e.target.value)),
});


const GroupCreateContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupCreateComponent);

export default GroupCreateContainer;
