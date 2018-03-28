import * as constants from '../static/constants';

/*
Auth state structure
{
  isSignedIn,
}
*/

const initialState = {
  // Default to null so that Lumi knows whether it has checked if the user is signed in
  isSignedIn: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_IS_SIGNED_IN:
      return {
        ...state,
        isSignedIn: action.isSignedIn,
      };
    default:
      return state;
  }
};

export default authReducer;
