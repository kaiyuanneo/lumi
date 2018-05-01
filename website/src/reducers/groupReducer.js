import * as constants from '../static/constants';

/*
Group state structure.
{
  groupIdFieldValue,
  groupNameFieldValue,
  groupCreateValidationState,
  groupJoinValidationState,
}
*/

const initialState = {
  groupIdFieldValue: '',
  groupJoinValidationState: null,
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_GROUP_ID_FIELD_VALUE:
      return {
        ...state,
        groupIdFieldValue: action.groupIdFieldValue,
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
