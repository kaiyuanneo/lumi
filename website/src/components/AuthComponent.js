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
  // Get user info from FB Graph API
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
  const userInfoRequestOptions = {
    uri: constants.URL_FACEBOOK_GRAPH_API_ME,
    qs: {
      access_token: credential.accessToken,
      fields: fields.join(),
    },
    json: true,
  };
  const userInfoParsedBody = await rp(userInfoRequestOptions);

  // Store user info in user record
  const db = firebase.database();
  const userRef = db.ref(`${constants.DB_PATH_USERS}/${currentUser.uid}`);
  await userRef.update({
    ...userInfoParsedBody,
    // Save parsedBody "id" param as "asid", and save Firebase UID as "uid"
    asid: userInfoParsedBody.id,
    uid: currentUser.uid,
    profile_pic: currentUser.photoURL,
  });

  // Get PSID from FB Graph API via Lumi webserver. Need to go through webserver
  // because we cannot expose FB app access token in client code.
  const psidRequestOptions = {
    uri: constants.URL_LUMI_PSID,
    qs: {
      asid: userInfoParsedBody.id,
    },
    json: true,
  };
  const { psid } = await rp(psidRequestOptions);
  // If the user does not have a PSID yet (i.e. hasn't chatted with Lumi Chat), return here
  // and the next time the user logs in with a PSID, it will get populated by the below code.
  if (!psid) {
    return false;
  }

  // Store PSID in user record
  await userRef.update({
    psid,
  });

  // Create entry in user-psid-to-uid path so that Lumi can look up user info with PSID
  await db.ref(constants.DB_PATH_USER_PSID_TO_UID).update({
    [psid]: currentUser.uid,
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
