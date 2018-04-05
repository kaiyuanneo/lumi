// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import hash from 'string-hash';

import * as actions from '../actions';
import CareCardEditWrapperComponent from '../components/CareCardEditWrapperComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


const mapStateToProps = (state, ownProps) => ({
  // DB field value refers to the value of the local field that is in sync with the value in the DB.
  dbFieldValue: state.careCard[ownProps.fieldId],
  // "Form field value" refers to the value of the field in forms. This is in contrast to
  // "display field value", which is what is rendered in Care Card fields outside of edit mode.
  formFieldValue: state.careCard[`${ownProps.fieldId}FormFieldValue`],
  isInEditMode: state.careCard[`${ownProps.fieldId}IsInEditMode`],
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  saveFieldValueLocally:
    fieldValue => dispatch(actions.saveCareCardFieldValueLocally(ownProps.fieldId, fieldValue)),
  saveFieldIsInEditMode:
    isInEditMode => dispatch(actions.saveCareCardFieldIsInEditMode(ownProps.fieldId, isInEditMode)),
});


export const _getDisplayFieldValue = (stateProps, ownProps) => {
  let displayFieldValue = stateProps.formFieldValue;
  if (!displayFieldValue) {
    displayFieldValue = 'Unspecified';
  } else if (ownProps.fieldId === constants.CARE_CARD_FIELD_ID_GENDER) {
    displayFieldValue = utils.genderCodeToName(displayFieldValue);
  } else if (ownProps.fieldId === constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA) {
    displayFieldValue = utils.dementiaCodeToName(displayFieldValue);
  }
  return displayFieldValue;
};


/**
 * Get formFieldValue, onChangeFunc, and saveButtonDisabled props
 */
export const _getMiscProps = (stateProps, dispatchProps, ownProps) => {
  // Set props for edit mode
  let { formFieldValue } = stateProps;
  // Set default onChangeFunc to handle changes in the form field
  let onChangeFunc = e => dispatchProps.saveFieldValueLocally(e.target.value);
  let saveButtonDisabled = false;
  // Update display value and onChangeFunc for date fields
  if (ownProps.isDateField) {
    // React Bootstrap Date Picker requires ISO strings, not MM/DD/YYYY strings used by FB
    formFieldValue = formFieldValue ? utils.usToIsoDate(formFieldValue) : '';
    // The onChange callback params for React Bootstrap Date Picker differ from other fields
    onChangeFunc = (value, formattedValue) => dispatchProps.saveFieldValueLocally(formattedValue);
  }
  // Disable save button for invalid email addresses in email field
  if (ownProps.fieldId === constants.CARE_CARD_FIELD_ID_EMAIL &&
      !utils.isValidEmail(formFieldValue)) {
    saveButtonDisabled = true;
  }
  return {
    formFieldValue,
    onChangeFunc,
    saveButtonDisabled,
  };
};


export const _saveFieldValueToDb = async (stateProps, dispatchProps, ownProps, formFieldValue) => {
  // Assume there is an active care recipient if user is seeing this component
  const db = firebase.database();
  const authUid = firebase.auth().currentUser.uid;
  const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  const activeGroupSnapshot = await activeGroupRef.once(constants.DB_EVENT_NAME_VALUE);
  // activeCareRecipient field in DB stores the UID of the currently active care recipient
  const careRecipientUidRef = db.ref((
    `${constants.DB_PATH_LUMI_GROUPS}/${activeGroupSnapshot.val()}/activeCareRecipient`));
  const careRecipientUidSnapshot = await careRecipientUidRef.once(constants.DB_EVENT_NAME_VALUE);
  const careRecipientUid = careRecipientUidSnapshot.val();
  const careRecipientRef = db.ref(`${constants.DB_PATH_USERS}/${careRecipientUid}`);
  // If updating email field, update entry in user-email-to-uid path
  if (ownProps.fieldId === constants.CARE_CARD_FIELD_ID_EMAIL) {
    db.ref(constants.DB_PATH_USER_EMAIL_TO_UID).update({
      [hash(stateProps.dbFieldValue)]: null,
      [hash(formFieldValue)]: careRecipientUid,
    });
  }
  // Update the field value in the DB
  // Read from stateProps because formFieldValue is updated for local forms in mergeProps
  careRecipientRef.update({ [ownProps.fieldId]: stateProps.formFieldValue });
  // Exit edit mode
  dispatchProps.saveFieldIsInEditMode(false);
};


const mergeProps = (stateProps, dispatchProps, ownProps) => {
  // Initialise displayFieldValue before formFieldValue gets manipulated
  const displayFieldValue = _getDisplayFieldValue(stateProps, ownProps);
  const miscProps = _getMiscProps(stateProps, dispatchProps, ownProps);
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    formField: ownProps.formFieldGenerator(miscProps.formFieldValue, miscProps.onChangeFunc),
    saveButtonDisabled: miscProps.saveButtonDisabled,
    // Set props for non-edit mode
    displayFieldValue,
    enterEditMode: () => dispatchProps.saveFieldIsInEditMode(true),
    // Reset form field value to DB field value and exit edit mode
    cancelEdits: () => {
      dispatchProps.saveFieldValueLocally(stateProps.dbFieldValue);
      dispatchProps.saveFieldIsInEditMode(false);
    },
    // Save field value to user record
    // NB: All data that overlaps with public data from the care recipient's Facebook profile
    // will be overwritten the next time the care recipient logs in with Facebook
    saveFieldValueToDb: () =>
      _saveFieldValueToDb(stateProps, dispatchProps, ownProps, miscProps.formFieldValue),
  };
};


const CareCardEditWrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CareCardEditWrapperComponent);

export default CareCardEditWrapperContainer;
