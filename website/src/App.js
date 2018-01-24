import * as firebase from 'firebase';
import React, { Component } from 'react';

import * as constants from './static/constants';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    // Initialise realtime database
    const dbConfig = {
      apiKey: constants.FIREBASE_API_KEY,
      authDomain: constants.FIREBASE_AUTH_DOMAIN,
      databaseURL: constants.FIREBASE_DATABASE_URL,
      storageBucket: constants.FIREBASE_STORAGE_BUCKET,
    };
    firebase.initializeApp(dbConfig);
  }

  componentDidMount() {
    const db = firebase.database();
    // Update local message state on DB writes
    const ref = db.ref(`${constants.DB_PATH_LUMI_MESSAGES}/${constants.MESSENGER_PSID_KAI}`);
    ref.on(constants.DB_EVENT_NAME_CHILD_ADDED, (messageSnapshot) => {
      this.setState({ messages: this.state.messages.concat(messageSnapshot.val()) });
    });
  }

  render() {
    const listItems = this.state.messages.map(message => <li key={message.mid}>{message.text}</li>);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">this is the end of React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ul>{listItems}</ul>
      </div>
    );
  }
}

export default App;
