import { combineReducers } from 'redux';

import careCardReducer from './careCardReducer';


// Each reducer's "state" param is the property of the global "state"
// object that corresponds to the reducer's name. For example, the "auth"
// reducer's "state" param references "state.auth".
const rootReducer = combineReducers({
  careCard: careCardReducer,
});

export default rootReducer;
