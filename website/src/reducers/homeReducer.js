import * as constants from '../static/constants';

/*
Home state structure. Stores state for Home and NavBar components
{
  currentProductCode,
  // Window width is used to determine when to fix content width in desktop mode
  windowWidth,
}
*/

const initialState = {
  currentProductCode: constants.PRODUCT_CODE_CARE_PROFILE,
  windowWidth: window.innerWidth,
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_CURRENT_PRODUCT_CODE:
      return {
        ...state,
        currentProductCode: action.currentProductCode,
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
