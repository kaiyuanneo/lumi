import PropTypes from 'prop-types';
import React from 'react';

import * as constants from '../static/constants';
import * as careProfileUtils from '../utils/careProfileUtils';


const CareProfileInfoMedicalComponent = (props) => {
  // Utility buttons below fields
  const buttons = careProfileUtils.getUtilityButtons(
    props.isInEditMode,
    props.saveFieldValuesToDb,
    props.cancelEdits,
    props.enterEditMode,
  );

  // Get display fields
  const displayFieldTypeOfDementia =
    careProfileUtils.renderDisplayField(props.displayFieldValueTypeOfDementia);
  const displayFieldDateOfDiagnosis =
    careProfileUtils.renderDisplayField(props.displayFieldValueDateOfDiagnosis);
  const displayFieldMedications =
    careProfileUtils.renderDisplayField(props.displayFieldValueMedications);
  const displayFieldProviders =
    careProfileUtils.renderDisplayField(props.displayFieldValueProviders);

  // Generate field content
  const fieldContentTypeOfDementia = props.isInEditMode ?
    careProfileUtils.getTypeOfDementiaField(
      props.formFieldValueTypeOfDementia,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA),
    ) : displayFieldTypeOfDementia;
  const fieldContentDateOfDiagnosis = props.isInEditMode ?
    careProfileUtils.getDateOfDiagnosisField(
      props.formFieldValueDateOfDiagnosis,
      props.getOnChangeFuncDate(constants.CARE_PROFILE_FIELD_ID_DATE_OF_DIAGNOSIS),
    ) : displayFieldDateOfDiagnosis;
  const fieldContentMedications = props.isInEditMode ?
    careProfileUtils.getMedicationsField(
      props.formFieldValueMedications,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_MEDICATIONS),
    ) : displayFieldMedications;
  const fieldContentProviders = props.isInEditMode ?
    careProfileUtils.getProvidersField(
      props.formFieldValueProviders,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_PROVIDERS),
    ) : displayFieldProviders;

  // Put everything together
  return (
    <div className="care-profile-info-container" >
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_TYPE_OF_DEMENTIA, fieldContentTypeOfDementia)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_DATE_OF_DIAGNOSIS, fieldContentDateOfDiagnosis)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_MEDICATIONS, fieldContentMedications)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_PROVIDERS, fieldContentProviders)}
      {buttons}
    </div>
  );
};

CareProfileInfoMedicalComponent.propTypes = {
  isInEditMode: PropTypes.bool.isRequired,
  displayFieldValueTypeOfDementia: PropTypes.string.isRequired,
  displayFieldValueDateOfDiagnosis: PropTypes.string.isRequired,
  displayFieldValueMedications: PropTypes.string.isRequired,
  displayFieldValueProviders: PropTypes.string.isRequired,
  formFieldValueTypeOfDementia: PropTypes.string.isRequired,
  formFieldValueDateOfDiagnosis: PropTypes.string.isRequired,
  formFieldValueMedications: PropTypes.string.isRequired,
  formFieldValueProviders: PropTypes.string.isRequired,
  getOnChangeFuncDate: PropTypes.func.isRequired,
  getOnChangeFuncNormal: PropTypes.func.isRequired,
  enterEditMode: PropTypes.func.isRequired,
  cancelEdits: PropTypes.func.isRequired,
  saveFieldValuesToDb: PropTypes.func.isRequired,
};

export default CareProfileInfoMedicalComponent;
