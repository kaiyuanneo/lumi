import * as constants from '../static/constants';


export const saveCareRecipientUid = careRecipientUid => ({
  type: constants.ACTION_SAVE_CARE_RECIPIENT_UID,
  careRecipientUid,
});

export const saveCareCardInfoCategory = infoCategory => ({
  type: constants.ACTION_SAVE_CARE_CARD_INFO_CATEGORY,
  infoCategory,
});

export const updateCareRecipient = careRecipient => ({
  type: constants.ACTION_UPDATE_CARE_RECIPIENT,
  careRecipient,
});

export const saveCareCardFieldValueLocally = (fieldId, fieldValue) => ({
  type: constants.ACTION_SAVE_CARE_CARD_FIELD_VALUE_LOCALLY,
  fieldId,
  fieldValue,
});

export const saveCareCardFieldIsInEditMode = (fieldId, isInEditMode) => ({
  type: constants.ACTION_SAVE_CARE_CARD_FIELD_IS_IN_EDIT_MODE,
  fieldId,
  isInEditMode,
});
