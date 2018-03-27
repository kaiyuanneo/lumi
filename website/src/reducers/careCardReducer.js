import * as constants from '../static/constants';


/*

Care Card state structure.
Lumi may store more fields than these in local state, but these are the ones Care Card needs.
For each field, store both a field value that is synced with the DB, and a field value that
may change based on edits to the local form field. This is so that if a user chooses to cancel
their changes, the field value will revert to that of the DB.
{
  infoCategory,
  // Do not render if Lumi has not finished fetching the active care recipient of this group
  fetched,

  uid,
  firstName,
  firstNameIsInEditMode,
  firstNameFormFieldValue,
  lastName,
  lastNameIsInEditMode,
  lastNameFormFieldValue,
  // Gender is stored in lowercase in the DB
  gender,
  genderIsInEditMode,
  genderFormFieldValue,

  // Birthday is stored in MM/DD/YYYY format in the DB
  birthday,
  birthdayIsInEditMode,
  birthdayFormFieldValue,
  profilePic,
  profilePicIsInEditMode,
  profilePicFormFieldValue,
  email,
  emailIsInEditMode,
  emailFormFieldValue,
  address,
  addressIsInEditMode,
  addressFormFieldValue,

  typeOfDementia,
  typeOfDementiaIsInEditMode,
  typeOfDementiaFormFieldValue,
  dateOfDiagnosis,
  dateOfDiagnosisIsInEditMode,
  dateOfDiagnosisFormFieldValue,
  medications,
  medicationsIsInEditMode,
  medicationsFormFieldValue,
  providers,
  providersIsInEditMode,
  providersFormFieldValue,

  needsAndPreferences,
  needsAndPreferencesIsInEditMode,
  needsAndPreferencesFormFieldValue,
  thingsThatDelight,
  thingsThatDelightIsInEditMode,
  thingsThatDelightFormFieldValue,
  placesOfInterest,
  placesOfInterestIsInEditMode,
  placesOfInterestFormFieldValue,
}
*/

const initialState = {
  infoCategory: constants.CARE_CARD_CATEGORY_CODE_BASIC,
  fetched: false,

  // Set initial values to empty string so prop types does not complain
  uid: '',
  firstName: '',
  lastName: '',
  gender: '',
  birthday: '',
  profilePic: '',
  email: '',
  address: '',
  typeOfDementia: '',
  dateOfDiagnosis: '',
  medications: '',
  providers: '',
  needsAndPreferences: '',
  thingsThatDelight: '',
  placesOfInterest: '',

  firstNameFormFieldValue: '',
  lastNameFormFieldValue: '',
  genderFormFieldValue: '',
  birthdayFormFieldValue: '',
  profilePicFormFieldValue: '',
  emailFormFieldValue: '',
  addressFormFieldValue: '',
  typeOfDementiaFormFieldValue: '',
  dateOfDiagnosisFormFieldValue: '',
  medicationsFormFieldValue: '',
  providersFormFieldValue: '',
  needsAndPreferencesFormFieldValue: '',
  thingsThatDelightFormFieldValue: '',
  placesOfInterestFormFieldValue: '',

  firstNameIsInEditMode: false,
  lastNameIsInEditMode: false,
  genderIsInEditMode: false,
  birthdayIsInEditMode: false,
  profilePicIsInEditMode: false,
  emailIsInEditMode: false,
  addressIsInEditMode: false,
  typeOfDementiaIsInEditMode: false,
  dateOfDiagnosisIsInEditMode: false,
  medicationsIsInEditMode: false,
  providersIsInEditMode: false,
  needsAndPreferencesIsInEditMode: false,
  thingsThatDelightIsInEditMode: false,
  placesOfInterestIsInEditMode: false,
};

const careCardReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_CARE_CARD_INFO_CATEGORY:
      return {
        ...state,
        infoCategory: action.infoCategory,
      };
    case constants.ACTION_TOGGLE_FETCHED_CARE_RECIPIENT:
      return {
        ...state,
        fetched: true,
      };
    case constants.ACTION_SAVE_CARE_RECIPIENT_UID:
      return {
        ...state,
        uid: action.careRecipientUid,
      };
    case constants.ACTION_UPDATE_CARE_RECIPIENT:
      return {
        ...state,
        ...action.careRecipient,
        // FormFieldValue is used to store the current state of each form field
        firstNameFormFieldValue: action.careRecipient.firstName,
        lastNameFormFieldValue: action.careRecipient.lastName,
        genderFormFieldValue: action.careRecipient.gender,
        birthdayFormFieldValue: action.careRecipient.birthday,
        profilePicFormFieldValue: action.careRecipient.profilePic,
        emailFormFieldValue: action.careRecipient.email,
        addressFormFieldValue: action.careRecipient.address,
        typeOfDementiaFormFieldValue: action.careRecipient.typeOfDementia,
        dateOfDiagnosisFormFieldValue: action.careRecipient.dateOfDiagnosis,
        medicationsFormFieldValue: action.careRecipient.medications,
        providersFormFieldValue: action.careRecipient.providers,
        needsAndPreferencesFormFieldValue: action.careRecipient.needsAndPreferences,
        thingsThatDelightFormFieldValue: action.careRecipient.thingsThatDelight,
        placesOfInterestFormFieldValue: action.careRecipient.placesOfInterest,
      };
    case constants.ACTION_SAVE_CARE_CARD_FIELD_VALUE_LOCALLY:
      return {
        ...state,
        [`${action.fieldId}FormFieldValue`]: action.fieldValue,
      };
    case constants.ACTION_SAVE_CARE_CARD_FIELD_IS_IN_EDIT_MODE:
      return {
        ...state,
        [`${action.fieldId}IsInEditMode`]: action.isInEditMode,
      };
    default:
      return state;
  }
};

export default careCardReducer;
