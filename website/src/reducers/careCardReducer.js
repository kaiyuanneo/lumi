import * as constants from '../static/constants';


/*

Care Card state structure.
Lumi may store more fields than these in local state, but these are the ones Care Card needs.
{
  infoCategory,
  // Do not render if Lumi has not finished fetching the active care recipient of this group
  fetched,

  uid,
  firstName,
  lastNAme,
  // Gender is stored in lowercase in the DB
  gender,

  // Birthday is stored in MM/DD/YYYY format in the DB
  birthday,
  profilePic,
  email,
  address,

  typeOfDementia,
  dateOfDiagnosis,
  medications,
  providers,

  needsAndPreferences,
  thingsThatDelight,
  placesOfInterest,
}
*/

const initialState = {
  infoCategory: constants.CARE_CARD_CATEGORY_CODE_BASIC,
  fetched: false,
  uid: null,
};

const careCardReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_CARE_CARD_INFO_CATEGORY:
      return {
        ...state,
        infoCategory: action.infoCategory,
      };
    case constants.ACTION_SAVE_CARE_RECIPIENT_UID:
      return {
        ...state,
        fetched: true,
        uid: action.careRecipientUid,
      };

    case constants.ACTION_UPDATE_CARE_RECIPIENT:
      return {
        ...state,
        ...action.careRecipient,
      };
    default:
      return state;
  }
};

export default careCardReducer;
