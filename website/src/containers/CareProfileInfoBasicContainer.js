// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import hash from 'string-hash';

import * as actions from '../actions';
import CareProfileInfoBasicComponent from '../components/CareProfileInfoBasicComponent';
import * as constants from '../static/constants';
import * as baseUtils from '../utils/baseUtils';
import * as careProfileUtils from '../utils/careProfileUtils';


const mapStateToProps = state => ({
  // DB field value refers to the value of the local field that is in sync with the value in the DB.
  dbFieldValueFirstName: state.careProfile.firstName,
  dbFieldValueLastName: state.careProfile.lastName,
  dbFieldValueBirthday: state.careProfile.birthday,
  dbFieldValueGender: state.careProfile.gender,
  dbFieldValueEmail: state.careProfile.email,
  dbFieldValueAddress: state.careProfile.address,
  // "Form field value" refers to the value of the field in forms. This is in contrast to
  // "display field value", which is what is rendered in CareProfile fields outside of edit mode.
  formFieldValueFirstName: state.careProfile.firstNameFormFieldValue,
  formFieldValueLastName: state.careProfile.lastNameFormFieldValue,
  formFieldValueBirthday: state.careProfile.birthdayFormFieldValue,
  formFieldValueGender: state.careProfile.genderFormFieldValue,
  formFieldValueEmail: state.careProfile.emailFormFieldValue,
  formFieldValueAddress: state.careProfile.addressFormFieldValue,
  isInEditMode: state.careProfile.basicInfoIsInEditMode,
});


const mapDispatchToProps = dispatch => ({
  saveFieldValueLocally: (fieldId, fieldValue) =>
    dispatch(actions.saveCareProfileFieldValueLocally(fieldId, fieldValue)),
  saveIsInEditMode: isInEditMode => dispatch(actions.saveCareProfileIsInEditMode(
    constants.CARE_PROFILE_INFO_TYPE_ID_BASIC, isInEditMode)),
});


/**
 * Disable save button for invalid email addresses in email field
 */
export const _getSaveButtonDisabled =
  stateProps => !baseUtils.isValidEmail(stateProps.formFieldValueEmail);


export const _cancelEdits = (stateProps, dispatchProps) => {
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_FIRST_NAME, stateProps.dbFieldValueFirstName);
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_LAST_NAME, stateProps.dbFieldValueLastName);
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_BIRTHDAY, stateProps.dbFieldValueBirthday);
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_GENDER, stateProps.dbFieldValueGender);
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_EMAIL, stateProps.dbFieldValueEmail);
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_ADDRESS, stateProps.dbFieldValueAddress);
  dispatchProps.saveIsInEditMode(false);
};


export const _saveFieldValuesToDb = async (stateProps, dispatchProps) => {
  // Assume there is an active care recipient if user is seeing this component
  const { careRecipientUid, careRecipientRef } = await baseUtils.getCareRecipientUidAndRef();
  // If updating email field, update entry in user-email-to-uid path
  firebase.database().ref(constants.DB_PATH_USER_EMAIL_TO_UID).update({
    [hash(stateProps.dbFieldValueEmail)]: null,
    [hash(stateProps.formFieldValueEmail)]: careRecipientUid,
  });
  // Update the field value in the DB
  // Read from stateProps because formFieldValue is updated for local forms in mergeProps
  careRecipientRef.update({
    [constants.CARE_PROFILE_FIELD_ID_FIRST_NAME]: stateProps.formFieldValueFirstName,
    [constants.CARE_PROFILE_FIELD_ID_LAST_NAME]: stateProps.formFieldValueLastName,
    [constants.CARE_PROFILE_FIELD_ID_BIRTHDAY]: stateProps.formFieldValueBirthday,
    [constants.CARE_PROFILE_FIELD_ID_GENDER]: stateProps.formFieldValueGender,
    [constants.CARE_PROFILE_FIELD_ID_EMAIL]: stateProps.formFieldValueEmail,
    [constants.CARE_PROFILE_FIELD_ID_ADDRESS]: stateProps.formFieldValueAddress,
  });
  // Exit edit mode
  dispatchProps.saveIsInEditMode(false);
};


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  // Display field values are field values for non-edit mode
  displayFieldValueFirstName: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueFirstName, constants.CARE_PROFILE_FIELD_ID_FIRST_NAME),
  displayFieldValueLastName: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueLastName, constants.CARE_PROFILE_FIELD_ID_LAST_NAME),
  displayFieldValueBirthday: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueBirthday, constants.CARE_PROFILE_FIELD_ID_BIRTHDAY),
  displayFieldValueGender: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueGender, constants.CARE_PROFILE_FIELD_ID_GENDER),
  displayFieldValueEmail: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueEmail, constants.CARE_PROFILE_FIELD_ID_EMAIL),
  displayFieldValueAddress: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueAddress, constants.CARE_PROFILE_FIELD_ID_ADDRESS),
  // Date form field values need to be in ISO in the frontend
  // Lumi stores date values in US date format in the DB
  formFieldValueBirthday:
    careProfileUtils.sanitiseDateFormFieldValue(stateProps.formFieldValueBirthday),
  // UI elements
  saveButtonDisabled: _getSaveButtonDisabled(stateProps),
  // The onChange callback params for React Bootstrap Date Picker differ from other fields
  getOnChangeFuncDate: fieldId =>
    (value, formattedValue) => dispatchProps.saveFieldValueLocally(fieldId, formattedValue),
  getOnChangeFuncNormal: fieldId =>
    e => dispatchProps.saveFieldValueLocally(fieldId, e.target.value),
  // UI navigation functions
  enterEditMode: () => dispatchProps.saveIsInEditMode(true),
  // Reset form field values to DB field values and exit edit mode
  cancelEdits: () => _cancelEdits(stateProps, dispatchProps),
  // Save field values to user record
  // NB: All data that overlaps with public data from the care recipient's Facebook profile
  // will be overwritten the next time the care recipient logs in with Facebook
  saveFieldValuesToDb: () => _saveFieldValuesToDb(stateProps, dispatchProps),
});


const CareProfileInfoBasicContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CareProfileInfoBasicComponent);

export default CareProfileInfoBasicContainer;
