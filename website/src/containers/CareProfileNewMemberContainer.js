// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import hash from 'string-hash';

import * as actions from '../actions';
import CareProfileNewMemberComponent from '../components/CareProfileNewMemberComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


// TODO(kai): Implement profile pic upload capability
const mapStateToProps = state => ({
  firstName: state.careProfile.firstNameFormFieldValue,
  lastName: state.careProfile.lastNameFormFieldValue,
  gender: state.careProfile.genderFormFieldValue,
  birthday: state.careProfile.birthdayFormFieldValue,
  email: state.careProfile.emailFormFieldValue,
  address: state.careProfile.addressFormFieldValue,
  typeOfDementia: state.careProfile.typeOfDementiaFormFieldValue,
  dateOfDiagnosis: state.careProfile.dateOfDiagnosisFormFieldValue,
  medications: state.careProfile.medicationsFormFieldValue,
  providers: state.careProfile.providersFormFieldValue,
  needsAndPreferences: state.careProfile.needsAndPreferencesFormFieldValue,
  thingsThatDelight: state.careProfile.thingsThatDelightFormFieldValue,
  placesOfInterest: state.careProfile.placesOfInterestFormFieldValue,
});


const mapDispatchToProps = dispatch => ({
  saveFieldValueLocally: (fieldId, fieldValue) =>
    dispatch(actions.saveCareProfileFieldValueLocally(fieldId, fieldValue)),
  unmountFunc: () => dispatch(actions.unmountCareProfileNewMemberForm()),
});


export const _saveNewMember = async (stateProps) => {
  const db = firebase.database();
  // Save new member info in user path as a new user and use an auto-generated key as user ID.
  // If this new member ever signs in, AuthComponent will merge this and the new member data.
  const newMemberRef = await db.ref(constants.DB_PATH_USERS).push({ ...stateProps });
  // Save new member email to user-email-to-uid table so that Lumi can merge this user's
  // profiles by email should this user ever sign in to Lumi.
  await db.ref(constants.DB_PATH_USER_EMAIL_TO_UID).update({
    [hash(stateProps.email)]: newMemberRef.key,
  });
  // Add new member to current group and set as active care recipient
  const authUid = firebase.auth().currentUser.uid;
  const activeGroupIdRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  const activeGroupIdSnapshot = await activeGroupIdRef.once(constants.DB_EVENT_NAME_VALUE);
  const activeGroupId = activeGroupIdSnapshot.val();
  await utils.addUserToGroup(activeGroupId, newMemberRef.key);
  await db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupId}`).update({
    activeCareRecipient: newMemberRef.key,
  });
};


const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const getHandleChangeFunc = fieldId => e =>
    dispatchProps.saveFieldValueLocally(fieldId, e.target.value);
  const getHandleChangeDateFunc = fieldId => (value, formattedValue) =>
    dispatchProps.saveFieldValueLocally(fieldId, formattedValue);
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    firstNameFormField: utils.getFirstNameFieldGenerator()(
      stateProps.firstName,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_FIRST_NAME),
    ),
    lastNameFormField: utils.getLastNameFieldGenerator()(
      stateProps.lastName,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_LAST_NAME),
    ),
    birthdayFormField: utils.getBirthdayFieldGenerator()(
      stateProps.birthday ? utils.usToIsoDate(stateProps.birthday) : '',
      getHandleChangeDateFunc(constants.CARE_PROFILE_FIELD_ID_BIRTHDAY),
    ),
    genderFormField: utils.getGenderFieldGenerator()(
      stateProps.gender,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_GENDER),
    ),
    emailFormField: utils.getEmailFieldGenerator()(
      stateProps.email,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_EMAIL),
    ),
    addressFormField: utils.getAddressFieldGenerator()(
      stateProps.address,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_ADDRESS),
    ),
    typeOfDementiaFormField: utils.getTypeOfDementiaFieldGenerator()(
      stateProps.typeOfDementia,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA),
    ),
    dateOfDiagnosisFormField: utils.getDateOfDiagnosisFieldGenerator()(
      stateProps.dateOfDiagnosis ? utils.usToIsoDate(stateProps.dateOfDiagnosis) : '',
      getHandleChangeDateFunc(constants.CARE_PROFILE_FIELD_ID_DATE_OF_DIAGNOSIS),
    ),
    medicationsFormField: utils.getMedicationsFieldGenerator()(
      stateProps.medications,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_MEDICATIONS),
    ),
    providersFormField: utils.getProvidersFieldGenerator()(
      stateProps.providers,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_PROVIDERS),
    ),
    needsAndPreferencesFormField: utils.getNeedsAndPreferencesFieldGenerator()(
      stateProps.needsAndPreferences,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_NEEDS_AND_PREFERENCES),
    ),
    thingsThatDelightFormField: utils.getThingsThatDelightFieldGenerator()(
      stateProps.thingsThatDelight,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_THINGS_THAT_DELIGHT),
    ),
    placesOfInterestFormField: utils.getPlacesOfInterestFieldGenerator()(
      stateProps.placesOfInterest,
      getHandleChangeFunc(constants.CARE_PROFILE_FIELD_ID_PLACES_OF_INTEREST),
    ),
    isSaveButtonDisabled: !utils.isValidEmail(stateProps.email),
    saveNewMember: () => _saveNewMember(stateProps),
  };
};

const CareProfileNewMemberContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CareProfileNewMemberComponent);

export default CareProfileNewMemberContainer;
