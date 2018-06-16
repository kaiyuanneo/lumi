import PropTypes from 'prop-types';
import React from 'react';

import * as constants from '../static/constants';
import * as careProfileUtils from '../utils/careProfileUtils';


const CareProfileInfoBasicComponent = (props) => {
  // Utility buttons below fields
  const buttons = careProfileUtils.getUtilityButtons(
    props.isInEditMode,
    props.saveFieldValuesToDb,
    props.cancelEdits,
    props.enterEditMode,
    props.saveButtonDisabled,
  );

  // Get display fields
  const displayFieldFirstName =
    careProfileUtils.renderDisplayField(props.displayFieldValueFirstName);
  const displayFieldLastName = careProfileUtils.renderDisplayField(props.displayFieldValueLastName);
  const displayFieldBirthday = careProfileUtils.renderDisplayField(props.displayFieldValueBirthday);
  const displayFieldGender = careProfileUtils.renderDisplayField(props.displayFieldValueGender);
  const displayFieldEmail = careProfileUtils.renderDisplayField(props.displayFieldValueEmail);
  const displayFieldAddress = careProfileUtils.renderDisplayField(props.displayFieldValueAddress);

  // Generate field content
  const fieldContentFirstName = props.isInEditMode ?
    careProfileUtils.getFirstNameField(
      props.formFieldValueFirstName,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_FIRST_NAME),
    ) : displayFieldFirstName;
  const fieldContentLastName = props.isInEditMode ?
    careProfileUtils.getLastNameField(
      props.formFieldValueLastName,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_LAST_NAME),
    ) : displayFieldLastName;
  const fieldContentBirthday = props.isInEditMode ?
    careProfileUtils.getBirthdayField(
      props.formFieldValueBirthday,
      props.getOnChangeFuncDate(constants.CARE_PROFILE_FIELD_ID_BIRTHDAY),
    ) : displayFieldBirthday;
  const fieldContentGender = props.isInEditMode ?
    careProfileUtils.getGenderField(
      props.formFieldValueGender,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_GENDER),
    ) : displayFieldGender;
  const fieldContentEmail = props.isInEditMode ?
    careProfileUtils.getEmailField(
      props.formFieldValueEmail,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_EMAIL),
    ) : displayFieldEmail;
  const fieldContentAddress = props.isInEditMode ?
    careProfileUtils.getAddressField(
      props.formFieldValueAddress,
      props.getOnChangeFuncNormal(constants.CARE_PROFILE_FIELD_ID_ADDRESS),
    ) : displayFieldAddress;

  // Put everything together
  return (
    <div className="care-profile-info-container" >
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_FIRST_NAME, fieldContentFirstName)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_LAST_NAME, fieldContentLastName)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_BIRTHDAY, fieldContentBirthday)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_GENDER, fieldContentGender)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_EMAIL, fieldContentEmail)}
      {careProfileUtils.renderField(
        constants.CARE_PROFILE_FIELD_TITLE_ADDRESS, fieldContentAddress)}
      {buttons}
    </div>
  );
};

CareProfileInfoBasicComponent.propTypes = {
  isInEditMode: PropTypes.bool.isRequired,
  saveButtonDisabled: PropTypes.bool.isRequired,
  displayFieldValueFirstName: PropTypes.string.isRequired,
  displayFieldValueLastName: PropTypes.string.isRequired,
  displayFieldValueBirthday: PropTypes.string.isRequired,
  displayFieldValueGender: PropTypes.string.isRequired,
  displayFieldValueEmail: PropTypes.string.isRequired,
  displayFieldValueAddress: PropTypes.string.isRequired,
  formFieldValueFirstName: PropTypes.string.isRequired,
  formFieldValueLastName: PropTypes.string.isRequired,
  formFieldValueBirthday: PropTypes.string.isRequired,
  formFieldValueGender: PropTypes.string.isRequired,
  formFieldValueEmail: PropTypes.string.isRequired,
  formFieldValueAddress: PropTypes.string.isRequired,
  getOnChangeFuncDate: PropTypes.func.isRequired,
  getOnChangeFuncNormal: PropTypes.func.isRequired,
  enterEditMode: PropTypes.func.isRequired,
  cancelEdits: PropTypes.func.isRequired,
  saveFieldValuesToDb: PropTypes.func.isRequired,
};

export default CareProfileInfoBasicComponent;
