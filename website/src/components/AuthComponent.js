import firebase from 'firebase';
import React from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import * as rp from 'request-promise';

import * as constants from '../static/constants';
import lumiLogo from '../static/images/logo.png';

/**
 * After user signs in with Facebook credentials, collect user information from Facebook
 * and save it in Firebase under the user record
 */
const setUserInfo = async (currentUser, credential) => {
  // Get user data from FB Graph API
  const fields = [
    'id',
    'first_name',
    'last_name',
    'locale',
    'timezone',
    'gender',
    'email',
    'birthday',
  ];
  const asidRequestOptions = {
    uri: constants.URL_FACEBOOK_GRAPH_API_ME,
    qs: {
      access_token: credential.accessToken,
      fields: fields.join(),
    },
    json: true,
  };
  const asidParsedBody = await rp(asidRequestOptions);

  // Store user data in user record
  const db = firebase.database();
  const userRef = db.ref(`${constants.DB_PATH_USERS}/${currentUser.uid}`);
  await userRef.set({
    ...asidParsedBody,
    // Save parsedBody "id" param as "asid", and save Firebase UID as "id"
    asid: asidParsedBody.id,
    id: currentUser.uid,
    profile_pic: currentUser.photoURL,
  });

  // Get PSID from FB Graph API via Lumi webserver. Need to go through webserver
  // because we cannot expose FB app access token in client code.
  const psidRequestOptions = {
    uri: constants.URL_LUMI_PSID,
    qs: {
      asid: asidParsedBody.id,
    },
    json: true,
  };
  const { psid } = await rp(psidRequestOptions);
  if (!psid) {
    throw new Error('Logged in user has no PSID for Lumi Facebook Page');
  }

  // Store PSID in user record
  await userRef.update({
    psid,
  });

  // Avoid redirects after sign in
  return false;
};


const AuthComponent = () => {
  const uiConfig = {
    callbacks: {
      signInSuccess: setUserInfo,
    },
    signInFlow: 'popup',
    signInOptions: [firebase.auth.FacebookAuthProvider.PROVIDER_ID],
  };

  return (
    <div>
      <header className="App-header">
        <img src={lumiLogo} className="App-logo" alt="logo" />
        <h1 className="App-title">{constants.WEBSITE_TITLE}</h1>
      </header>
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};

export default AuthComponent;
