import { combineReducers } from 'redux';

import careCardReducer from './careCardReducer';
import groupReducer from './groupReducer';
import homeReducer from './homeReducer';


// Each reducer's "state" param is the property of the global "state"
// object that corresponds to the reducer's name. For example, the "auth"
// reducer's "state" param references "state.auth".
const rootReducer = combineReducers({
  careCard: careCardReducer,
  group: groupReducer,
  home: homeReducer,
});

export default rootReducer;
