// NB: Private functions are underscore-prefixed and exported for tests
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import * as actions from '../actions';
import CareProfileInfoMedicalComponent from '../components/CareProfileInfoMedicalComponent';
import * as constants from '../static/constants';
import * as baseUtils from '../utils/baseUtils';
import * as careProfileUtils from '../utils/careProfileUtils';


const mapStateToProps = state => ({
  // DB field value refers to the value of the local field that is in sync with the value in the DB.
  dbFieldValueTypeOfDementia: state.careProfile.typeOfDementia,
  dbFieldValueDateOfDiagnosis: state.careProfile.dateOfDiagnosis,
  dbFieldValueMedications: state.careProfile.medications,
  dbFieldValueProviders: state.careProfile.providers,
  // "Form field value" refers to the value of the field in forms. This is in contrast to
  // "display field value", which is what is rendered in CareProfile fields outside of edit mode.
  formFieldValueTypeOfDementia: state.careProfile.typeOfDementiaFormFieldValue,
  formFieldValueDateOfDiagnosis: state.careProfile.dateOfDiagnosisFormFieldValue,
  formFieldValueMedications: state.careProfile.medicationsFormFieldValue,
  formFieldValueProviders: state.careProfile.providersFormFieldValue,
  isInEditMode: state.careProfile.medicalInfoIsInEditMode,
});


const mapDispatchToProps = dispatch => ({
  saveFieldValueLocally: (fieldId, fieldValue) =>
    dispatch(actions.saveCareProfileFieldValueLocally(fieldId, fieldValue)),
  saveIsInEditMode: isInEditMode => dispatch(actions.saveCareProfileIsInEditMode(
    constants.CARE_PROFILE_INFO_TYPE_ID_MEDICAL, isInEditMode)),
});


export const _cancelEdits = (stateProps, dispatchProps) => {
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA, stateProps.dbFieldValueTypeOfDementia);
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_DATE_OF_DIAGNOSIS, stateProps.dbFieldValueDateOfDiagnosis);
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_MEDICATIONS, stateProps.dbFieldValueMedications);
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_PROVIDERS, stateProps.dbFieldValueProviders);
  dispatchProps.saveIsInEditMode(false);
};


export const _saveFieldValuesToDb = async (stateProps, dispatchProps) => {
  const { careRecipientRef } = await baseUtils.getCareRecipientUidAndRef();
  // Update the field value in the DB
  // Read from stateProps because formFieldValue is updated for local forms in mergeProps
  careRecipientRef.update({
    [constants.CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA]: stateProps.formFieldValueTypeOfDementia,
    [constants.CARE_PROFILE_FIELD_ID_DATE_OF_DIAGNOSIS]: stateProps.formFieldValueDateOfDiagnosis,
    [constants.CARE_PROFILE_FIELD_ID_MEDICATIONS]: stateProps.formFieldValueMedications,
    [constants.CARE_PROFILE_FIELD_ID_PROVIDERS]: stateProps.formFieldValueProviders,
  });
  // Exit edit mode
  dispatchProps.saveIsInEditMode(false);
};


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  // Display field values are field values for non-edit mode
  displayFieldValueTypeOfDementia: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueTypeOfDementia, constants.CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA),
  displayFieldValueDateOfDiagnosis: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueDateOfDiagnosis, constants.CARE_PROFILE_FIELD_ID_DATE_OF_DIAGNOSIS),
  displayFieldValueMedications: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueMedications, constants.CARE_PROFILE_FIELD_ID_MEDICATIONS),
  displayFieldValueProviders: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueProviders, constants.CARE_PROFILE_FIELD_ID_PROVIDERS),
  // Date form field values need to be in ISO in the frontend
  // Lumi stores date values in US date format in the DB
  formFieldValueDateOfDiagnosis:
    careProfileUtils.sanitiseDateFormFieldValue(stateProps.formFieldValueDateOfDiagnosis),
  // UI elements
  // The onChange callback params for React Bootstrap Date Picker differ from other fields
  getOnChangeFuncDate: fieldId =>
    (value, formattedValue) => dispatchProps.saveFieldValueLocally(fieldId, formattedValue),
  getOnChangeFuncNormal: fieldId =>
    e => dispatchProps.saveFieldValueLocally(fieldId, e.target.value),
  // UI navigation functions
  enterEditMode: () => {
    ReactGA.event({
      category: constants.GA_CATEGORY_CARE_PROFILE,
      action: constants.GA_ACTION_TAP_MEDICAL_EDIT,
    });
    dispatchProps.saveIsInEditMode(true);
  },
  // Reset form field values to DB field values and exit edit mode
  cancelEdits: () => {
    ReactGA.event({
      category: constants.GA_CATEGORY_CARE_PROFILE,
      action: constants.GA_ACTION_TAP_MEDICAL_CANCEL,
    });
    _cancelEdits(stateProps, dispatchProps);
  },
  // Save field values to user record
  // NB: All data that overlaps with public data from the care recipient's Facebook profile
  // will be overwritten the next time the care recipient logs in with Facebook
  saveFieldValuesToDb: () => {
    ReactGA.event({
      category: constants.GA_CATEGORY_CARE_PROFILE,
      action: constants.GA_ACTION_TAP_MEDICAL_SAVE,
    });
    _saveFieldValuesToDb(stateProps, dispatchProps);
  },
});


const CareProfileInfoMedicalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CareProfileInfoMedicalComponent);

export default CareProfileInfoMedicalContainer;
