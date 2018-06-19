import * as firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import App from './App';
import * as constants from './static/constants';
// Support styles for all classes in this app
import './static/styles.css';
// TODO(kai): Enable this once Lumi is stable enough to enable caching
// import registerServiceWorker from './utils/registerServiceWorker';

// Initialise Google Analytics
ReactGA.initialize('UA-120992883-1');

// Initialise Firebase
const firebaseConfig = {
  apiKey: constants.FIREBASE_API_KEY,
  authDomain: constants.FIREBASE_AUTH_DOMAIN,
  databaseURL: constants.FIREBASE_DATABASE_URL,
  storageBucket: constants.FIREBASE_STORAGE_BUCKET,
};
firebase.initializeApp(firebaseConfig);

// Persist authentication even when site refreshed or window closed
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

ReactDOM.render(<App />, document.getElementById('root'));
// TODO(kai): Enable this once Lumi is stable enough to enable caching
// registerServiceWorker();
