import * as constants from '../static/constants';

/*
Auth state structure
{
  isSignedIn,
  // First name of auth user
  firstName,
}
*/

const initialState = {
  // Default to null so that Lumi knows whether it has checked if the user is signed in
  isSignedIn: null,
  firstName: '',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_IS_SIGNED_IN:
      return {
        ...state,
        isSignedIn: action.isSignedIn,
      };
    case constants.ACTION_SAVE_AUTH_USER_FIRST_NAME:
      return {
        ...state,
        firstName: action.firstName,
      };
    default:
      return state;
  }
};

export default authReducer;
