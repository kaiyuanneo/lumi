import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import RootContainer from './containers/RootContainer';
import rootReducer from './reducers';


const App = () => (
  <Provider store={createStore(rootReducer)}>
    <RootContainer />
  </Provider>
);

export default App;
