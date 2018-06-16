import * as constants from '../static/constants';

/*
Group state structure.
{
  isAuthUserInGroup,
  // State that determines which UI to render on the group add page
  groupAddState,
  // Array of all the groups the auth user is currently a member of. Each group is an object
  // that contains 2 keys "id" and "name".
  groups,
  groupId,
  groupName,
  // Group field values are used for the field values in AddGroupComponent
  groupFirstNameFieldValue,
  groupLastNameFieldValue,
  groupIdFieldValue,
  groupJoinValidationState,
}
*/

const initialState = {
  // Null is an initial value to indicate that this information has not been fetched yet
  isAuthUserInGroup: null,
  groupAddState: constants.GROUP_ADD_STATE_CREATE_OR_JOIN,
  groups: [],
  groupId: null,
  groupName: null,
  groupFirstNameFieldValue: '',
  groupLastNameFieldValue: '',
  groupIdFieldValue: '',
  groupJoinValidationState: null,
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_IS_AUTH_USER_IN_GROUP:
      return {
        ...state,
        isAuthUserInGroup: action.isAuthUserInGroup,
      };
    case constants.ACTION_SAVE_AUTH_USER_GROUP_INFO: {
      state.groups.push({
        id: action.groupId,
        name: action.groupName,
      });
      return {
        ...state,
        // Need to create new array to trigger re-render
        groups: [...state.groups],
      };
    }
    case constants.ACTION_SAVE_AUTH_USER_ACTIVE_GROUP_INFO:
      return {
        ...state,
        groupId: action.groupId,
        groupName: action.groupName,
      };
    case constants.ACTION_SWITCH_GROUP: {
      let groupName = 'Group Not Found';
      for (let i = 0; i < state.groups.length; i += 1) {
        if (state.groups[i].id === action.groupId) {
          groupName = state.groups[i].name;
        }
      }
      return {
        ...state,
        groupName,
        groupId: action.groupId,
      };
    }
    case constants.ACTION_SAVE_GROUP_FIRST_NAME_FIELD_VALUE:
      return {
        ...state,
        groupFirstNameFieldValue: action.groupFirstNameFieldValue,
      };
    case constants.ACTION_SAVE_GROUP_LAST_NAME_FIELD_VALUE:
      return {
        ...state,
        groupLastNameFieldValue: action.groupLastNameFieldValue,
      };
    case constants.ACTION_SAVE_GROUP_ID_FIELD_VALUE:
      return {
        ...state,
        groupIdFieldValue: action.groupIdFieldValue,
      };
    case constants.ACTION_SAVE_GROUP_ADD_STATE:
      return {
        ...state,
        groupAddState: action.groupAddState,
      };
    case constants.ACTION_SAVE_GROUP_JOIN_VALIDATION_STATE:
      return {
        ...state,
        groupJoinValidationState: action.groupJoinValidationState,
      };
    default:
      return state;
  }
};

export default groupReducer;
