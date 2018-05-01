import * as constants from '../static/constants';


/*
 * Auth actions
 */

export const saveIsSignedIn = isSignedIn => ({
  type: constants.ACTION_SAVE_IS_SIGNED_IN,
  isSignedIn,
});

export const saveAuthUserFirstName = firstName => ({
  type: constants.ACTION_SAVE_AUTH_USER_FIRST_NAME,
  firstName,
});

/*
 * Home and navbar management actions
 */

export const saveIsAuthUserInGroup = isAuthUserInGroup => ({
  type: constants.ACTION_SAVE_IS_AUTH_USER_IN_GROUP,
  isAuthUserInGroup,
});

export const saveCurrentProductCode = currentProductCode => ({
  type: constants.ACTION_SAVE_CURRENT_PRODUCT_CODE,
  currentProductCode,
});

export const saveAuthUserGroupInfo = (groupId, groupName) => ({
  type: constants.ACTION_SAVE_AUTH_USER_GROUP_INFO,
  groupId,
  groupName,
});

export const saveWindowWidth = windowWidth => ({
  type: constants.ACTION_SAVE_WINDOW_WIDTH,
  windowWidth,
});

/*
 * Group management actions
 */

export const saveGroupIdFieldValue = groupIdFieldValue => ({
  type: constants.ACTION_SAVE_GROUP_ID_FIELD_VALUE,
  groupIdFieldValue,
});

export const saveGroupJoinValidationState = groupJoinValidationState => ({
  type: constants.ACTION_SAVE_GROUP_JOIN_VALIDATION_STATE,
  groupJoinValidationState,
});

export const saveGroupNameFieldValue = groupNameFieldValue => ({
  type: constants.ACTION_SAVE_GROUP_NAME_FIELD_VALUE,
  groupNameFieldValue,
  groupCreateValidationState: groupNameFieldValue === '' ? 'error' : 'success',
});

/*
 * Care profile Actions
 */

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

export const saveCareProfileFieldValueLocally = (fieldId, fieldValue) => ({
  type: constants.ACTION_SAVE_CARE_PROFILE_FIELD_VALUE_LOCALLY,
  fieldId,
  fieldValue,
});

export const saveCareProfileFieldIsInEditMode = (fieldId, isInEditMode) => ({
  type: constants.ACTION_SAVE_CARE_PROFILE_FIELD_IS_IN_EDIT_MODE,
  fieldId,
  isInEditMode,
});

export const unmountCareProfileNewMemberForm = () => ({
  type: constants.ACTION_UNMOUNT_CARE_PROFILE_NEW_MEMBER_FORM,
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

/*
 * Timeline Actions
 */

export const saveNumMessages = numMessages => ({
  type: constants.ACTION_SAVE_NUM_MESSAGES,
  numMessages,
});

export const saveTimelineMessage = message => ({
  type: constants.ACTION_SAVE_TIMELINE_MESSAGE,
  message,
});

export const deleteTimelineMessage = message => ({
  type: constants.ACTION_DELETE_TIMELINE_MESSAGE,
  message,
});

export const saveTimelineFilterCategories = filterCategories => ({
  type: constants.ACTION_SAVE_TIMELINE_FILTER_CATEGORIES,
  filterCategories,
});

export const toggleTimelineFilterButtons = showFilters => ({
  type: constants.ACTION_TOGGLE_TIMELINE_FILTER_BUTTONS,
  showFilters,
});
