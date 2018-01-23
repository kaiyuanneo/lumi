import * as firebase from 'firebase';
import React, { Component } from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import * as rp from 'request-promise';

import * as constants from './static/constants';
import logo from './logo.svg';
import './App.css';


// Initialise Firebase
const firebaseConfig = {
  apiKey: constants.FIREBASE_API_KEY,
  authDomain: constants.FIREBASE_AUTH_DOMAIN,
  databaseURL: constants.FIREBASE_DATABASE_URL,
  storageBucket: constants.FIREBASE_STORAGE_BUCKET,
};
firebase.initializeApp(firebaseConfig);


class App extends Component {
  constructor(props) {
    super(props);

    // Initialise local message state
    this.state = {
      messages: [],
      signedIn: false,
      signedInUid: '',
    };

    this.db = firebase.database();
  }

  async signInAndSetUserInfo(currentUser, credential) {
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
    const userRef = this.db.ref(`${constants.DB_PATH_USERS}/${currentUser.uid}`);
    userRef.set({
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
    userRef.update({
      psid,
    });

    // Activate listener on logged-in user's messages
    const messagesRef = this.db.ref(`${constants.DB_PATH_LUMI_MESSAGES}/${psid}`);
    messagesRef.on(constants.DB_EVENT_NAME_CHILD_ADDED, (messageSnapshot) => {
      this.setState({ messages: this.state.messages.concat(messageSnapshot.val()) });
    });

    // Update state to signal signed-in status
    this.setState({
      ...this.state,
      signedIn: true,
      signedInUid: currentUser.uid,
    });

    // Avoid redirects after sign in
    return false;
  }

  // Decide to display login or home screen
  render() {
    let body;
    if (this.state.signedIn) {
      const messages =
        this.state.messages.map(message => <li key={message.mid}>{message.text}</li>);
      body = <ul>{messages}</ul>;
    } else {
      const uiConfig = {
        callbacks: {
          signInSuccess: async (currentUser, credential) => {
            await this.signInAndSetUserInfo(currentUser, credential);
            this.setState({
              ...this.state,
              signedIn: true,
            });
          },
        },
        signInFlow: 'popup',
        signInOptions: [firebase.auth.FacebookAuthProvider.PROVIDER_ID],
      };
      body = (
        <div>
          <p>Please sign in:</p>
          <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Lumi Cares</h1>
        </header>
        {body}
      </div>
    );
  }
}

export default App;
