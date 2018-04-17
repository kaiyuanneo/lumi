import { combineReducers } from 'redux';

import authReducer from './authReducer';
import summaryReducer from './summaryReducer';
import groupReducer from './groupReducer';
import homeReducer from './homeReducer';
import timelineReducer from './timelineReducer';


// Each reducer's "state" param is the property of the global "state"
// object that corresponds to the reducer's name. For example, the "auth"
// reducer's "state" param references "state.auth".
const rootReducer = combineReducers({
  auth: authReducer,
  summary: summaryReducer,
  group: groupReducer,
  home: homeReducer,
  timeline: timelineReducer,
});

export default rootReducer;
