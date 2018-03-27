import * as firebase from 'firebase';
import React from 'react';
import { FormControl, FormGroup, Tab, Table } from 'react-bootstrap';
import DatePicker from 'react-16-bootstrap-date-picker';
import validator from 'validator';

import * as constants from '../static/constants';


/**
 * Convert US date format (MM/DD/YYYY, used by Facebook) to ISO date format
 */
export const usToIsoDate = (usDate) => {
  const dateComponents = usDate.split('/');
  const year = parseInt(dateComponents[2], 10);
  // Javascript Date month attribute is 0-indexed
  const month = parseInt(dateComponents[0], 10) - 1;
  const day = parseInt(dateComponents[1], 10);
  return new Date(Date.UTC(year, month, day)).toISOString();
};

/**
 * Determine if input is valid for email field. Accept empty string.
 */
export const isValidEmail = input => !input || validator.isEmail(input);

export const categoryCodeToName = (categoryCode) => {
  switch (categoryCode) {
    case constants.CARE_CARD_CATEGORY_CODE_BASIC:
      return constants.CARE_CARD_CATEGORY_NAME_BASIC;
    case constants.CARE_CARD_CATEGORY_CODE_MEDICAL:
      return constants.CARE_CARD_CATEGORY_NAME_MEDICAL;
    case constants.CARE_CARD_CATEGORY_CODE_CARE:
      return constants.CARE_CARD_CATEGORY_NAME_CARE;
    case constants.TIMELINE_CATEGORY_CODE_ALL:
      return constants.TIMELINE_CATEGORY_NAME_ALL;
    case constants.TIMELINE_CATEGORY_CODE_ACTIVITY:
      return constants.TIMELINE_CATEGORY_NAME_ACTIVITY;
    case constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR:
      return constants.TIMELINE_CATEGORY_NAME_BEHAVIOUR;
    case constants.TIMELINE_CATEGORY_CODE_MOOD:
      return constants.TIMELINE_CATEGORY_NAME_MOOD;
    case constants.TIMELINE_CATEGORY_CODE_MEMORY:
      return constants.TIMELINE_CATEGORY_NAME_MEMORY;
    case constants.TIMELINE_CATEGORY_CODE_MEDICAL:
      return constants.TIMELINE_CATEGORY_NAME_MEDICAL;
    case constants.TIMELINE_CATEGORY_CODE_CAREGIVER:
      return constants.TIMELINE_CATEGORY_NAME_CAREGIVER;
    case constants.TIMELINE_CATEGORY_CODE_OTHER:
      return constants.TIMELINE_CATEGORY_NAME_OTHER;
    default:
      return 'NA';
  }
};

/**
 * Convert type of dementia code to name
 * Currently this only uppercases the first letter, but will be more complex with other languages
 */
export const dementiaCodeToName = (dementiaCode) => {
  switch (dementiaCode) {
    case constants.CARE_CARD_DEMENTIA_CODE_ALZHEIMERS:
      return constants.CARE_CARD_DEMENTIA_NAME_ALZHEIMERS;
    case constants.CARE_CARD_DEMENTIA_CODE_VASCULAR:
      return constants.CARE_CARD_DEMENTIA_NAME_VASCULAR;
    case constants.CARE_CARD_DEMENTIA_CODE_LEWY:
      return constants.CARE_CARD_DEMENTIA_NAME_LEWY;
    case constants.CARE_CARD_DEMENTIA_CODE_FRONTOTEMPORAL:
      return constants.CARE_CARD_DEMENTIA_NAME_FRONTOTEMPORAL;
    case constants.CARE_CARD_DEMENTIA_CODE_CREUTZFELDT_JAKOB:
      return constants.CARE_CARD_DEMENTIA_NAME_CREUTZFELDT_JAKOB;
    case constants.CARE_CARD_DEMENTIA_CODE_WERNICKE_KORSAKOFF:
      return constants.CARE_CARD_DEMENTIA_NAME_WERNICKE_KORSAKOFF;
    case constants.CARE_CARD_DEMENTIA_CODE_MIXED:
      return constants.CARE_CARD_DEMENTIA_NAME_MIXED;
    case constants.CARE_CARD_DEMENTIA_CODE_OTHER:
      return constants.CARE_CARD_DEMENTIA_NAME_OTHER;
    case constants.CARE_CARD_DEMENTIA_CODE_UNKNOWN:
      return constants.CARE_CARD_DEMENTIA_NAME_UNKNOWN;
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
 * 1) Update a user record to reference the new group
 * 2) If this is a user's first group, mark all of their existing messages to belong to the group
 */
export const addUserToGroup = async (gid, uid = firebase.auth().currentUser.uid) => {
  const db = firebase.database();
  const userRef = db.ref(`${constants.DB_PATH_USERS}/${uid}`);

  // Update activeGroup in user record to be current group ID
  // Add group ID to groups list in user record (gid: true)
  await userRef.update({
    activeGroup: gid,
    [`groups/${gid}`]: true,
  });

  // Add user as a member in group record in lumi-groups (uid: true)
  await db.ref(constants.DB_PATH_LUMI_GROUPS).update({
    [`${gid}/members/${uid}`]: true,
  });

  // Return if this is not the user's first group
  const userGroupsSnapshot = await userRef.child('groups').once(constants.DB_EVENT_NAME_VALUE);
  if (Object.keys(userGroupsSnapshot.val()).length > 1) {
    return;
  }

  // If the user has no PSID, they have not used Lumi Chat, thus have no messages yet
  const psidSnapshot = await userRef.child('psid').once(constants.DB_EVENT_NAME_VALUE);
  const psid = psidSnapshot.val();
  if (!psid) {
    return;
  }

  // Access user messages
  const userMessagesRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES_USER}/${psid}`);
  const userMessagesSnapshot = await userMessagesRef.once(constants.DB_EVENT_NAME_VALUE);
  const userMessages = userMessagesSnapshot.val();

  // Return if the user has no messages yet
  if (!userMessages) {
    return;
  }

  // Copy all user message references to the group
  await db.ref(`${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${gid}`).update({ ...userMessages });

  // Update each of the user's messages to reference the new GID
  const messageUpdates = {};
  Object.keys(userMessages).forEach((messageKey) => {
    messageUpdates[`${messageKey}/group`] = gid;
  });
  await db.ref(constants.DB_PATH_LUMI_MESSAGES).update(messageUpdates);
};

/**
 * Get tab component for timeline and care card products
 */
export const getTabComponent = categoryCode => (
  <Tab
    eventKey={categoryCode}
    title={categoryCodeToName(categoryCode)}
  />
);

/**
 * Wrap passed component with a Table, specifically for Care Card
 */
export const wrapWithCareCardTable = component => (
  <Table bordered hover>
    <thead>
      <tr>
        <th className="product-table-header">{constants.CARE_CARD_TABLE_HEADER_FIELD}</th>
        <th className="product-table-header">{constants.CARE_CARD_TABLE_HEADER_VALUE}</th>
        <th className="product-table-header">{constants.CARE_CARD_TABLE_HEADER_OPTIONS}</th>
      </tr>
    </thead>
    {component}
  </Table>
);

/**
 * Wrap passed component with a FormGroup
 */
const wrapWithFormGroup = (id, component, validationState = null) => (
  <FormGroup controlId={id} validationState={validationState}>
    {component}
  </FormGroup>
);

/**
 * Get text field generator for CareCardEditWrapperComponent to render field
 */
const getTextFieldGenerator = (id, placeholder, isEmailField = false) =>
  (fieldValue, onChangeFunc) => {
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
      emailValidationState = isValidEmail(fieldValue) ?
        constants.FORM_VALIDATION_SUCCESS : constants.FORM_VALIDATION_ERROR;
    }
    return wrapWithFormGroup(id, formControl, emailValidationState);
  };

/**
 * Get textarea field generator for CareCardEditWrapperComponent to render field
 */
const getTextAreaFieldGenerator = (id, placeholder) => (fieldValue, onChangeFunc) => {
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
 * Get date field generator for CareCardEditWrapperComponent to render field
 */
const getDateFieldGenerator = id => (fieldValue, onChangeFunc) => {
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
 * Get select field generator for CareCardEditWrapperComponent to render field
 * options is an object with option codes as keys and option names as values
 */
const getSelectFieldGenerator = (id, placeholder, options) => (fieldValue, onChangeFunc) => {
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

export const getFirstNameFieldGenerator = () => getTextFieldGenerator(
  constants.CARE_CARD_FIELD_ID_FIRST_NAME,
  constants.CARE_CARD_FIELD_PLACEHOLDER_FIRST_NAME,
);

export const getLastNameFieldGenerator = () => getTextFieldGenerator(
  constants.CARE_CARD_FIELD_ID_LAST_NAME,
  constants.CARE_CARD_FIELD_PLACEHOLDER_LAST_NAME,
);

export const getBirthdayFieldGenerator = () =>
  getDateFieldGenerator(constants.CARE_CARD_FIELD_ID_BIRTHDAY);

export const getGenderFieldGenerator = () => getSelectFieldGenerator(
  constants.CARE_CARD_FIELD_ID_GENDER,
  constants.CARE_CARD_FIELD_PLACEHOLDER_GENDER,
  {
    [constants.CARE_CARD_GENDER_CODE_FEMALE]:
      constants.CARE_CARD_GENDER_NAME_FEMALE,
    [constants.CARE_CARD_GENDER_CODE_MALE]: constants.CARE_CARD_GENDER_NAME_MALE,
  },
);

export const getEmailFieldGenerator = () => getTextFieldGenerator(
  constants.CARE_CARD_FIELD_ID_EMAIL,
  constants.CARE_CARD_FIELD_PLACEHOLDER_EMAIL,
  true,
);


export const getAddressFieldGenerator = () => getTextAreaFieldGenerator(
  constants.CARE_CARD_FIELD_ID_ADDRESS,
  constants.CARE_CARD_FIELD_PLACEHOLDER_ADDRESS,
);

export const getTypeOfDementiaFieldGenerator = () => getSelectFieldGenerator(
  constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA,
  constants.CARE_CARD_FIELD_PLACEHOLDER_TYPE_OF_DEMENTIA,
  {
    [constants.CARE_CARD_DEMENTIA_CODE_ALZHEIMERS]:
      constants.CARE_CARD_DEMENTIA_NAME_ALZHEIMERS,
    [constants.CARE_CARD_DEMENTIA_CODE_VASCULAR]:
      constants.CARE_CARD_DEMENTIA_NAME_VASCULAR,
    [constants.CARE_CARD_DEMENTIA_CODE_LEWY]:
      constants.CARE_CARD_DEMENTIA_NAME_LEWY,
    [constants.CARE_CARD_DEMENTIA_CODE_FRONTOTEMPORAL]:
      constants.CARE_CARD_DEMENTIA_NAME_FRONTOTEMPORAL,
    [constants.CARE_CARD_DEMENTIA_CODE_CREUTZFELDT_JAKOB]:
      constants.CARE_CARD_DEMENTIA_NAME_CREUTZFELDT_JAKOB,
    [constants.CARE_CARD_DEMENTIA_CODE_WERNICKE_KORSAKOFF]:
      constants.CARE_CARD_DEMENTIA_NAME_WERNICKE_KORSAKOFF,
    [constants.CARE_CARD_DEMENTIA_CODE_MIXED]:
      constants.CARE_CARD_DEMENTIA_NAME_MIXED,
    [constants.CARE_CARD_DEMENTIA_CODE_OTHER]:
      constants.CARE_CARD_DEMENTIA_NAME_OTHER,
    [constants.CARE_CARD_DEMENTIA_CODE_UNKNOWN]:
      constants.CARE_CARD_DEMENTIA_NAME_UNKNOWN,
  },
);

export const getDateOfDiagnosisFieldGenerator = () =>
  getDateFieldGenerator(constants.CARE_CARD_FIELD_ID_DATE_OF_DIAGNOSIS);

export const getMedicationsFieldGenerator = () => getTextAreaFieldGenerator(
  constants.CARE_CARD_FIELD_ID_MEDICATIONS,
  constants.CARE_CARD_FIELD_PLACEHOLDER_MEDICATIONS,
);

export const getProvidersFieldGenerator = () => getTextAreaFieldGenerator(
  constants.CARE_CARD_FIELD_ID_PROVIDERS,
  constants.CARE_CARD_FIELD_PLACEHOLDER_PROVIDERS,
);

export const getNeedsAndPreferencesFieldGenerator = () => getTextAreaFieldGenerator(
  constants.CARE_CARD_FIELD_ID_NEEDS_AND_PREFERENCES,
  constants.CARE_CARD_FIELD_PLACEHOLDER_NEEDS_AND_PREFERENCES,
);

export const getThingsThatDelightFieldGenerator = () => getTextAreaFieldGenerator(
  constants.CARE_CARD_FIELD_ID_THINGS_THAT_DELIGHT,
  constants.CARE_CARD_FIELD_PLACEHOLDER_THINGS_THAT_DELIGHT,
);

export const getPlacesOfInterestFieldGenerator = () => getTextAreaFieldGenerator(
  constants.CARE_CARD_FIELD_ID_PLACES_OF_INTEREST,
  constants.CARE_CARD_FIELD_PLACEHOLDER_PLACES_OF_INTEREST,
);
