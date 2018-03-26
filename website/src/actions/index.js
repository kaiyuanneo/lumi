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
