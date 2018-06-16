// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';

import * as actions from '../actions';
import CareProfileInfoCareComponent from '../components/CareProfileInfoCareComponent';
import * as constants from '../static/constants';
import * as baseUtils from '../utils/baseUtils';
import * as careProfileUtils from '../utils/careProfileUtils';


const mapStateToProps = state => ({
  // DB field value refers to the value of the local field that is in sync with the value in the DB.
  dbFieldValueNeedsAndPreferences: state.careProfile.needsAndPreferences,
  dbFieldValueThingsThatDelight: state.careProfile.thingsThatDelight,
  dbFieldValuePlacesOfInterest: state.careProfile.placesOfInterest,
  // "Form field value" refers to the value of the field in forms. This is in contrast to
  // "display field value", which is what is rendered in CareProfile fields outside of edit mode.
  formFieldValueNeedsAndPreferences: state.careProfile.needsAndPreferencesFormFieldValue,
  formFieldValueThingsThatDelight: state.careProfile.thingsThatDelightFormFieldValue,
  formFieldValuePlacesOfInterest: state.careProfile.placesOfInterestFormFieldValue,
  isInEditMode: state.careProfile.careInfoIsInEditMode,
});


const mapDispatchToProps = dispatch => ({
  saveFieldValueLocally: (fieldId, fieldValue) =>
    dispatch(actions.saveCareProfileFieldValueLocally(fieldId, fieldValue)),
  saveIsInEditMode: isInEditMode => dispatch(actions.saveCareProfileIsInEditMode(
    constants.CARE_PROFILE_INFO_TYPE_ID_CARE, isInEditMode)),
});


export const _cancelEdits = (stateProps, dispatchProps) => {
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_NEEDS_AND_PREFERENCES,
    stateProps.dbFieldValueNeedsAndPreferences,
  );
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_THINGS_THAT_DELIGHT, stateProps.dbFieldValueThingsThatDelight);
  dispatchProps.saveFieldValueLocally(
    constants.CARE_PROFILE_FIELD_ID_PLACES_OF_INTEREST, stateProps.dbFieldValuePlacesOfInterest);
  dispatchProps.saveIsInEditMode(false);
};


export const _saveFieldValuesToDb = async (stateProps, dispatchProps) => {
  const { careRecipientRef } = await baseUtils.getCareRecipientUidAndRef();
  // Update the field value in the DB
  // Read from stateProps because formFieldValue is updated for local forms in mergeProps
  careRecipientRef.update({
    [constants.CARE_PROFILE_FIELD_ID_NEEDS_AND_PREFERENCES]:
      stateProps.formFieldValueNeedsAndPreferences,
    [constants.CARE_PROFILE_FIELD_ID_THINGS_THAT_DELIGHT]:
      stateProps.formFieldValueThingsThatDelight,
    [constants.CARE_PROFILE_FIELD_ID_PLACES_OF_INTEREST]:
      stateProps.formFieldValuePlacesOfInterest,
  });
  // Exit edit mode
  dispatchProps.saveIsInEditMode(false);
};


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  // Display field values are field values for non-edit mode
  displayFieldValueNeedsAndPreferences: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueNeedsAndPreferences,
    constants.CARE_PROFILE_FIELD_ID_NEEDS_AND_PREFERENCES,
  ),
  displayFieldValueThingsThatDelight: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValueThingsThatDelight,
    constants.CARE_PROFILE_FIELD_ID_THINGS_THAT_DELIGHT,
  ),
  displayFieldValuePlacesOfInterest: careProfileUtils.getDisplayFieldValue(
    stateProps.formFieldValuePlacesOfInterest, constants.CARE_PROFILE_FIELD_ID_PLACES_OF_INTEREST),
  // UI elements
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


const CareProfileInfoCareContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CareProfileInfoCareComponent);

export default CareProfileInfoCareContainer;
