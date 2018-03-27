import * as constants from '../static/constants';


/*
 * Care Card Actions
 */

export const saveCareCardInfoCategory = infoCategory => ({
  type: constants.ACTION_SAVE_CARE_CARD_INFO_CATEGORY,
  infoCategory,
});

export const toggleFetchedCareRecipient = () => ({
  type: constants.ACTION_TOGGLE_FETCHED_CARE_RECIPIENT,
});

export const saveCareRecipientUid = careRecipientUid => ({
  type: constants.ACTION_SAVE_CARE_RECIPIENT_UID,
  careRecipientUid,
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

export const unmountCareCardNewMemberForm = () => ({
  type: constants.ACTION_UNMOUNT_CARE_CARD_NEW_MEMBER_FORM,
});

// selectedMember is a member ID
export const updateSelectCrSelectedMember = selectedMember => ({
  type: constants.ACTION_UPDATE_SELECT_CR_SELECTED_MEMBER,
  selectedMember,
});

export const toggleSelectCrUserClickedSelect = () => ({
  type: constants.ACTION_TOGGLE_SELECT_CR_USER_CLICKED_SELECT,
});

export const updateSelectCrGroupMembers = members => ({
  type: constants.ACTION_UPDATE_SELECT_CR_GROUP_MEMBERS,
  members,
});
