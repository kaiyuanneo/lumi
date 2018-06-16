import React from 'react';
import { Button, ButtonToolbar, FormControl, FormGroup, Glyphicon } from 'react-bootstrap';
import DatePicker from 'react-16-bootstrap-date-picker';

import * as baseUtils from './baseUtils';
import * as constants from '../static/constants';


// TODO(kai): Turn the following UI elements into their own classes
// Render individual field
export const renderField = (fieldTitle, fieldContent) => (
  <div>
    <b>{fieldTitle}</b>
    {fieldContent}
  </div>
);


// Get display fields
export const renderDisplayField = fieldValue => <div>{fieldValue}<br /><br /></div>;


export const getUtilityButtons = (
  isInEditMode,
  saveFieldValuesToDb,
  cancelEdits,
  enterEditMode,
  saveButtonDisabled = false,
) => (
  isInEditMode ? (
    <ButtonToolbar>
      <Button
        bsStyle="primary"
        disabled={saveButtonDisabled}
        onClick={saveFieldValuesToDb}
      >
        {constants.BUTTON_TEXT_SAVE}
      </Button>
      <Button onClick={cancelEdits}>
        {constants.BUTTON_TEXT_CANCEL}
      </Button>
    </ButtonToolbar>
  ) : (
    <Button onClick={enterEditMode}>
      <Glyphicon className="button-icon" glyph="pencil" />
      {constants.BUTTON_TEXT_EDIT}
    </Button>
  )
);


/**
 * Date form field values in the UI require ISO dates
 * React Bootstrap Date Picker requires ISO strings, not MM/DD/YYYY strings used by FB
 */
export const sanitiseDateFormFieldValue = usDate => (usDate ? baseUtils.usToIsoDate(usDate) : '');


/**
 * Convert type of dementia code to name
 * Currently this only uppercases the first letter, but will be more complex with other languages
 */
export const dementiaCodeToName = (dementiaCode) => {
  switch (dementiaCode) {
    case constants.CARE_PROFILE_DEMENTIA_CODE_ALZHEIMERS:
      return constants.CARE_PROFILE_DEMENTIA_NAME_ALZHEIMERS;
    case constants.CARE_PROFILE_DEMENTIA_CODE_VASCULAR:
      return constants.CARE_PROFILE_DEMENTIA_NAME_VASCULAR;
    case constants.CARE_PROFILE_DEMENTIA_CODE_LEWY:
      return constants.CARE_PROFILE_DEMENTIA_NAME_LEWY;
    case constants.CARE_PROFILE_DEMENTIA_CODE_FRONTOTEMPORAL:
      return constants.CARE_PROFILE_DEMENTIA_NAME_FRONTOTEMPORAL;
    case constants.CARE_PROFILE_DEMENTIA_CODE_CREUTZFELDT_JAKOB:
      return constants.CARE_PROFILE_DEMENTIA_NAME_CREUTZFELDT_JAKOB;
    case constants.CARE_PROFILE_DEMENTIA_CODE_WERNICKE_KORSAKOFF:
      return constants.CARE_PROFILE_DEMENTIA_NAME_WERNICKE_KORSAKOFF;
    case constants.CARE_PROFILE_DEMENTIA_CODE_MIXED:
      return constants.CARE_PROFILE_DEMENTIA_NAME_MIXED;
    case constants.CARE_PROFILE_DEMENTIA_CODE_OTHER:
      return constants.CARE_PROFILE_DEMENTIA_NAME_OTHER;
    case constants.CARE_PROFILE_DEMENTIA_CODE_UNKNOWN:
      return constants.CARE_PROFILE_DEMENTIA_NAME_UNKNOWN;
    default:
      return 'Undefined';
  }
};


/**
 * Convert gender code to name
 * Currently this only uppercases the first letter, but will be more complex with other languages
 */
export const genderCodeToName = genderCode =>
  genderCode.charAt(0).toUpperCase() + genderCode.slice(1);


/**
 * Convert DB field values to display field values
 */
export const getDisplayFieldValue = (formFieldValue, fieldId) => {
  let displayFieldValue = formFieldValue;
  if (!displayFieldValue) {
    displayFieldValue = 'Unspecified';
  } else if (fieldId === constants.CARE_PROFILE_FIELD_ID_GENDER) {
    displayFieldValue = genderCodeToName(displayFieldValue);
  } else if (fieldId === constants.CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA) {
    displayFieldValue = dementiaCodeToName(displayFieldValue);
  }
  return displayFieldValue;
};


/**
 * Wrap passed component with a FormGroup
 */
const wrapWithFormGroup = (id, component, validationState = null) => (
  <FormGroup controlId={id} validationState={validationState}>
    {component}
  </FormGroup>
);


/**
 * Get text field
 */
const getTextField = (id, placeholder, fieldValue, onChangeFunc, isEmailField = false) => {
  const formControl = (
    <FormControl
      type="text"
      value={fieldValue}
      placeholder={placeholder}
      onChange={onChangeFunc}
    />
  );
  if (!isEmailField) {
    return wrapWithFormGroup(id, formControl);
  }
  // Perform email validation if email field. Accept empty field value.
  let emailValidationState = null;
  if (fieldValue) {
    emailValidationState = baseUtils.isValidEmail(fieldValue) ?
      constants.FORM_VALIDATION_SUCCESS : constants.FORM_VALIDATION_ERROR;
  }
  return wrapWithFormGroup(id, formControl, emailValidationState);
};


/**
 * Get textarea field
 */
const getTextAreaField = (id, placeholder, fieldValue, onChangeFunc) => {
  const formControl = (
    <FormControl
      componentClass="textarea"
      value={fieldValue}
      placeholder={placeholder}
      onChange={onChangeFunc}
    />
  );
  return wrapWithFormGroup(id, formControl);
};


/**
 * Get date field
 */
const getDateField = (id, fieldValue, onChangeFunc) => {
  const datePicker = (
    <DatePicker
      id={id}
      dateFormat={constants.US_DATE_FORMAT}
      value={fieldValue}
      onChange={onChangeFunc}
    />
  );
  return wrapWithFormGroup(id, datePicker);
};


/**
 * Get select field
 * options is an object with option codes as keys and option names as values
 */
const getSelectField = (id, placeholder, fieldValue, onChangeFunc, options) => {
  const optionElements = Object.keys(options).map(optionCode => (
    <option key={optionCode} value={optionCode}>
      {options[optionCode]}
    </option>
  ));
  const formControl = (
    <FormControl
      componentClass="select"
      value={fieldValue}
      placeholder={placeholder}
      onChange={onChangeFunc}
    >
      {optionElements}
    </FormControl>
  );
  return wrapWithFormGroup(id, formControl);
};


export const getFirstNameField = (fieldValue, onChangeFunc) => getTextField(
  constants.CARE_PROFILE_FIELD_ID_FIRST_NAME,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_FIRST_NAME,
  fieldValue,
  onChangeFunc,
);


export const getLastNameField = (fieldValue, onChangeFunc) => getTextField(
  constants.CARE_PROFILE_FIELD_ID_LAST_NAME,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_LAST_NAME,
  fieldValue,
  onChangeFunc,
);


export const getBirthdayField = (fieldValue, onChangeFunc) => getDateField(
  constants.CARE_PROFILE_FIELD_ID_BIRTHDAY,
  fieldValue,
  onChangeFunc,
);


export const getGenderField = (fieldValue, onChangeFunc) => getSelectField(
  constants.CARE_PROFILE_FIELD_ID_GENDER,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_GENDER,
  fieldValue,
  onChangeFunc,
  {
    [constants.CARE_PROFILE_CODE_UNSPECIFIED]: constants.CARE_PROFILE_NAME_UNSPECIFIED,
    [constants.CARE_PROFILE_GENDER_CODE_FEMALE]:
      constants.CARE_PROFILE_GENDER_NAME_FEMALE,
    [constants.CARE_PROFILE_GENDER_CODE_MALE]: constants.CARE_PROFILE_GENDER_NAME_MALE,
  },
);


export const getEmailField = (fieldValue, onChangeFunc) => getTextField(
  constants.CARE_PROFILE_FIELD_ID_EMAIL,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_EMAIL,
  fieldValue,
  onChangeFunc,
  true,
);


export const getAddressField = (fieldValue, onChangeFunc) => getTextAreaField(
  constants.CARE_PROFILE_FIELD_ID_ADDRESS,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_ADDRESS,
  fieldValue,
  onChangeFunc,
);


export const getTypeOfDementiaField = (fieldValue, onChangeFunc) => getSelectField(
  constants.CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_TYPE_OF_DEMENTIA,
  fieldValue,
  onChangeFunc,
  {
    [constants.CARE_PROFILE_CODE_UNSPECIFIED]: constants.CARE_PROFILE_NAME_UNSPECIFIED,
    [constants.CARE_PROFILE_DEMENTIA_CODE_ALZHEIMERS]:
      constants.CARE_PROFILE_DEMENTIA_NAME_ALZHEIMERS,
    [constants.CARE_PROFILE_DEMENTIA_CODE_VASCULAR]:
      constants.CARE_PROFILE_DEMENTIA_NAME_VASCULAR,
    [constants.CARE_PROFILE_DEMENTIA_CODE_LEWY]:
      constants.CARE_PROFILE_DEMENTIA_NAME_LEWY,
    [constants.CARE_PROFILE_DEMENTIA_CODE_FRONTOTEMPORAL]:
      constants.CARE_PROFILE_DEMENTIA_NAME_FRONTOTEMPORAL,
    [constants.CARE_PROFILE_DEMENTIA_CODE_CREUTZFELDT_JAKOB]:
      constants.CARE_PROFILE_DEMENTIA_NAME_CREUTZFELDT_JAKOB,
    [constants.CARE_PROFILE_DEMENTIA_CODE_WERNICKE_KORSAKOFF]:
      constants.CARE_PROFILE_DEMENTIA_NAME_WERNICKE_KORSAKOFF,
    [constants.CARE_PROFILE_DEMENTIA_CODE_MIXED]:
      constants.CARE_PROFILE_DEMENTIA_NAME_MIXED,
    [constants.CARE_PROFILE_DEMENTIA_CODE_OTHER]:
      constants.CARE_PROFILE_DEMENTIA_NAME_OTHER,
    [constants.CARE_PROFILE_DEMENTIA_CODE_UNKNOWN]:
      constants.CARE_PROFILE_DEMENTIA_NAME_UNKNOWN,
  },
);


export const getDateOfDiagnosisField = (fieldValue, onChangeFunc) => getDateField(
  constants.CARE_PROFILE_FIELD_ID_DATE_OF_DIAGNOSIS,
  fieldValue,
  onChangeFunc,
);


export const getMedicationsField = (fieldValue, onChangeFunc) => getTextAreaField(
  constants.CARE_PROFILE_FIELD_ID_MEDICATIONS,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_MEDICATIONS,
  fieldValue,
  onChangeFunc,
);


export const getProvidersField = (fieldValue, onChangeFunc) => getTextAreaField(
  constants.CARE_PROFILE_FIELD_ID_PROVIDERS,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_PROVIDERS,
  fieldValue,
  onChangeFunc,
);


export const getNeedsAndPreferencesField = (fieldValue, onChangeFunc) => getTextAreaField(
  constants.CARE_PROFILE_FIELD_ID_NEEDS_AND_PREFERENCES,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_NEEDS_AND_PREFERENCES,
  fieldValue,
  onChangeFunc,
);


export const getThingsThatDelightField = (fieldValue, onChangeFunc) => getTextAreaField(
  constants.CARE_PROFILE_FIELD_ID_THINGS_THAT_DELIGHT,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_THINGS_THAT_DELIGHT,
  fieldValue,
  onChangeFunc,
);


export const getPlacesOfInterestField = (fieldValue, onChangeFunc) => getTextAreaField(
  constants.CARE_PROFILE_FIELD_ID_PLACES_OF_INTEREST,
  constants.CARE_PROFILE_FIELD_PLACEHOLDER_PLACES_OF_INTEREST,
  fieldValue,
  onChangeFunc,
);
