import * as constants from '../static/constants';

/*
Home state structure. Stores state for Home and NavBar components
{
  isAuthUserInGroup,
  currentProductCode,
  groupId,
  groupName,
  windowWidth,
}
*/

const initialState = {
  // Null is an initial value to indicate that this information has not been fetched yet
  isAuthUserInGroup: null,
  currentProductCode: constants.PRODUCT_CODE_TIMELINE,
  groupId: null,
  groupName: null,
  windowWidth: window.innerWidth,
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_IS_AUTH_USER_IN_GROUP:
      return {
        ...state,
        isAuthUserInGroup: action.isAuthUserInGroup,
      };
    case constants.ACTION_SAVE_CURRENT_PRODUCT_CODE:
      return {
        ...state,
        currentProductCode: action.currentProductCode,
      };
    case constants.ACTION_SAVE_AUTH_USER_GROUP_INFO:
      return {
        ...state,
        groupId: action.groupId,
        groupName: action.groupName,
      };
    case constants.ACTION_SAVE_WINDOW_WIDTH:
      return {
        ...state,
        windowWidth: action.windowWidth,
      };
    default:
      return state;
  }
};

export default homeReducer;
