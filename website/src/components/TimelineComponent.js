import firebase from 'firebase';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import * as constants from '../static/constants';


class TimelineComponent extends Component {
  constructor(props) {
    super(props);

    // Initialise local message state
    this.state = {
      messages: [],
    };

    // Sync local message state with auth user message state in Firebase
    const db = firebase.database();
    const authUser = firebase.auth().currentUser;
    if (!authUser) {
      throw new Error('Rendering Timeline component when no user has logged in');
    }
    const userRef = db.ref(`${constants.DB_PATH_USERS}/${authUser.uid}`);
    userRef.once(constants.DB_EVENT_NAME_VALUE, (userSnapshot) => {
      // Get auth user PSID
      const { psid } = userSnapshot.val();

      // Activate listener on auth user's messages
      const messagesRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES}/${psid}`);
      messagesRef.on(constants.DB_EVENT_NAME_CHILD_ADDED, (messageSnapshot) => {
        this.setState({ messages: this.state.messages.concat(messageSnapshot.val()) });
      });
    });
  }

  render() {
    const messages = this.state.messages.map(message => <li key={message.mid}>{message.text}</li>);
    const signOut = () => {
      firebase.auth().signOut();
    };
    return (
      <div>
        <ul>{messages}</ul>
        <Button onClick={signOut}>Sign Out</Button>
      </div>
    );
  }
}

export default TimelineComponent;
