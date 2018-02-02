import * as firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as constants from './static/constants';
import './static/styles.css';
// import registerServiceWorker from './utils/registerServiceWorker';


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
