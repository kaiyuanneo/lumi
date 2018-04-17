// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import hash from 'string-hash';

import * as actions from '../actions';
import SummaryNewMemberComponent from '../components/SummaryNewMemberComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


// TODO(kai): Implement profile pic upload capability
const mapStateToProps = state => ({
  firstName: state.summary.firstNameFormFieldValue,
  lastName: state.summary.lastNameFormFieldValue,
  gender: state.summary.genderFormFieldValue,
  birthday: state.summary.birthdayFormFieldValue,
  email: state.summary.emailFormFieldValue,
  address: state.summary.addressFormFieldValue,
  typeOfDementia: state.summary.typeOfDementiaFormFieldValue,
  dateOfDiagnosis: state.summary.dateOfDiagnosisFormFieldValue,
  medications: state.summary.medicationsFormFieldValue,
  providers: state.summary.providersFormFieldValue,
  needsAndPreferences: state.summary.needsAndPreferencesFormFieldValue,
  thingsThatDelight: state.summary.thingsThatDelightFormFieldValue,
  placesOfInterest: state.summary.placesOfInterestFormFieldValue,
});


const mapDispatchToProps = dispatch => ({
  saveFieldValueLocally: (fieldId, fieldValue) =>
    dispatch(actions.saveSummaryFieldValueLocally(fieldId, fieldValue)),
  unmountFunc: () => dispatch(actions.unmountSummaryNewMemberForm()),
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
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_FIRST_NAME),
    ),
    lastNameFormField: utils.getLastNameFieldGenerator()(
      stateProps.lastName,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_LAST_NAME),
    ),
    birthdayFormField: utils.getBirthdayFieldGenerator()(
      stateProps.birthday ? utils.usToIsoDate(stateProps.birthday) : '',
      getHandleChangeDateFunc(constants.SUMMARY_FIELD_ID_BIRTHDAY),
    ),
    genderFormField: utils.getGenderFieldGenerator()(
      stateProps.gender,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_GENDER),
    ),
    emailFormField: utils.getEmailFieldGenerator()(
      stateProps.email,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_EMAIL),
    ),
    addressFormField: utils.getAddressFieldGenerator()(
      stateProps.address,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_ADDRESS),
    ),
    typeOfDementiaFormField: utils.getTypeOfDementiaFieldGenerator()(
      stateProps.typeOfDementia,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_TYPE_OF_DEMENTIA),
    ),
    dateOfDiagnosisFormField: utils.getDateOfDiagnosisFieldGenerator()(
      stateProps.dateOfDiagnosis ? utils.usToIsoDate(stateProps.dateOfDiagnosis) : '',
      getHandleChangeDateFunc(constants.SUMMARY_FIELD_ID_DATE_OF_DIAGNOSIS),
    ),
    medicationsFormField: utils.getMedicationsFieldGenerator()(
      stateProps.medications,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_MEDICATIONS),
    ),
    providersFormField: utils.getProvidersFieldGenerator()(
      stateProps.providers,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_PROVIDERS),
    ),
    needsAndPreferencesFormField: utils.getNeedsAndPreferencesFieldGenerator()(
      stateProps.needsAndPreferences,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_NEEDS_AND_PREFERENCES),
    ),
    thingsThatDelightFormField: utils.getThingsThatDelightFieldGenerator()(
      stateProps.thingsThatDelight,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_THINGS_THAT_DELIGHT),
    ),
    placesOfInterestFormField: utils.getPlacesOfInterestFieldGenerator()(
      stateProps.placesOfInterest,
      getHandleChangeFunc(constants.SUMMARY_FIELD_ID_PLACES_OF_INTEREST),
    ),
    isSaveButtonDisabled: !utils.isValidEmail(stateProps.email),
    saveNewMember: () => _saveNewMember(stateProps),
  };
};

const SummaryNewMemberContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(SummaryNewMemberComponent);

export default SummaryNewMemberContainer;
