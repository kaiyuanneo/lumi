import * as constants from '../static/constants';

/*
Care Card state structure.
{
  groupNameFieldValue,
  groupCreateValidationState,

}
*/

const initialState = {
  groupNameFieldValue: '',
  groupCreateValidationState: null,
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_GROUP_NAME_FIELD_VALUE:
      return {
        ...state,
        groupNameFieldValue: action.groupNameFieldValue,
        groupCreateValidationState: action.groupNameFieldValue === '' ? 'error' : 'success',
      };
    default:
      return state;
  }
};

export default groupReducer;
