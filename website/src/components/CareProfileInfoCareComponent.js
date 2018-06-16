import PropTypes from 'prop-types';
import React from 'react';

import * as constants from '../static/constants';
import * as careProfileUtils from '../utils/careProfileUtils';


const CareProfileInfoCareComponent = (props) => {
  // Utility buttons below fields
  const buttons = careProfileUtils.getUtilityButtons(
    props.isInEditMode,
    props.saveFieldValuesToDb,
    props.cancelEdits,
    props.enterEditMode,
  );

  // Get display fields
  const displayFieldNeedsAndPreferences =
    careProfileUtils.renderDisplayField(props.displayFieldValueNeedsAndPreferences);
  const displayFieldThingsThatDelight =
    careProfileUtils.renderDisplayField(props.displayFieldValueThingsThatDelight);
  const displayFieldPlacesOfInterest =
    careProfileUtils.renderDisplayField(props.displayFieldValuePlacesOfInterest);

  // Generate field content
  const fieldContentNeedsAndPreferences = props.isInEditMode ?
    careProfileUtils.getNeedsAndPreferencesField(
      props.formFieldValueNeedsAndPreferences,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_NEEDS_AND_PREFERENCES),
    ) : displayFieldNeedsAndPreferences;
  const fieldContentThingsThatDelight = props.isInEditMode ?
    careProfileUtils.getThingsThatDelightField(
      props.formFieldValueThingsThatDelight,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_THINGS_THAT_DELIGHT),
    ) : displayFieldThingsThatDelight;
  const fieldContentPlacesOfInterest = props.isInEditMode ?
    careProfileUtils.getPlacesOfInterestField(
      props.formFieldValuePlacesOfInterest,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_PLACES_OF_INTEREST),
    ) : displayFieldPlacesOfInterest;

  // Put everything together
  return (
    <div className="care-profile-info-container" >
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_NEEDS_AND_PREFERENCES, fieldContentNeedsAndPreferences)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_THINGS_THAT_DELIGHT, fieldContentThingsThatDelight)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_PLACES_OF_INTEREST, fieldContentPlacesOfInterest)}
      {buttons}
    </div>
  );
};

CareProfileInfoCareComponent.propTypes = {
  isInEditMode: PropTypes.bool.isRequired,
  displayFieldValueNeedsAndPreferences: PropTypes.string.isRequired,
  displayFieldValueThingsThatDelight: PropTypes.string.isRequired,
  displayFieldValuePlacesOfInterest: PropTypes.string.isRequired,
  formFieldValueNeedsAndPreferences: PropTypes.string.isRequired,
  formFieldValueThingsThatDelight: PropTypes.string.isRequired,
  formFieldValuePlacesOfInterest: PropTypes.string.isRequired,
  getOnChangeFuncNormal: PropTypes.func.isRequired,
  enterEditMode: PropTypes.func.isRequired,
  cancelEdits: PropTypes.func.isRequired,
  saveFieldValuesToDb: PropTypes.func.isRequired,
};

export default CareProfileInfoCareComponent;
