import firebase from 'firebase';
import React from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import * as rp from 'request-promise';
import hash from 'string-hash';

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

  // If user already has user record, e.g. if created as New Member by another member
  // in Care Card, then copy contents of existing user record to new user record with new UID
  const db = firebase.database();
  // Use numeric-hashed emails in Realtime Database paths because RD does not support '.' in paths.
  const hashedEmail = hash(userInfoParsedBody.email);
  const existingUidRef =
    db.ref(`${constants.DB_PATH_USER_EMAIL_TO_UID}/${hashedEmail}`);
  const existingUidSnapshot = await existingUidRef.once(constants.DB_EVENT_NAME_VALUE);
  const existingUid = existingUidSnapshot.val();
  let existingUser = {};
  // Only execute the following if user record with auth user's email already exists and the UID
  // is different from the UID of the current auth user
  if (existingUid && existingUid !== currentUser.uid) {
    const existingUserRef = db.ref(`${constants.DB_PATH_USERS}/${existingUid}`);
    const existingUserSnapshot = await existingUserRef.once(constants.DB_EVENT_NAME_VALUE);
    // Store old user info in a local variable
    existingUser = existingUserSnapshot.val();
    // Delete the old user record
    existingUserRef.remove();
    // Update old user's group to reference new UID
    const groupsArray = Object.keys(existingUser.groups);
    for (let i = 0; i < groupsArray.length; i += 1) {
      const gid = groupsArray[i];
      const groupRef = db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${gid}`);
      groupRef.once(constants.DB_EVENT_NAME_VALUE, (groupSnapshot) => {
        groupRef.child('members').update({
          [existingUid]: null,
          [currentUser.uid]: true,
        });
        if (groupSnapshot.val().activeCareRecipient === existingUid) {
          groupRef.update({
            activeCareRecipient: currentUser.uid,
          });
        }
      });
    }
  }

  // Create/update entry in user-email-to-uid so that Lumi can look up user info with email
  // If user was initially a Care-Card-generated user, this will remove the reference to the
  // old UID.
  await db.ref(constants.DB_PATH_USER_EMAIL_TO_UID).update({
    [hash(userInfoParsedBody.email)]: currentUser.uid,
  });

  // Store user info in user record
  const userRef = db.ref(`${constants.DB_PATH_USERS}/${currentUser.uid}`);
  await userRef.update({
    // Copy any info from a previously created user in Care Card that has never signed in
    ...existingUser,
    ...userInfoParsedBody,
    // Do not copy id field from userInfoParsedBody to prevent confusion with uid
    id: null,
    // Save parsedBody "id" param as "asid", and save Firebase UID as "uid"
    asid: userInfoParsedBody.id,
    uid: currentUser.uid,
    // Use camelCase instead of snake_case to be consistent in the DB
    firstName: userInfoParsedBody.first_name,
    lastName: userInfoParsedBody.last_name,
    first_name: null,
    last_name: null,
    // Store profile picture from FB auth
    profilePic: currentUser.photoURL,
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
