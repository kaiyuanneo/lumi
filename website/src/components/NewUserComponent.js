import * as firebase from 'firebase';
import React, { Component } from 'react';

import GroupCreateComponent from './GroupCreateComponent';
import GroupJoinComponent from './GroupJoinComponent';
import * as constants from '../static/constants';


class NewUserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
    };
  }

  componentDidMount() {
    const { uid } = firebase.auth().currentUser;
    const firstNameRef = firebase.database().ref(`${constants.DB_PATH_USERS}/${uid}/first_name`);
    firstNameRef.once(constants.DB_EVENT_NAME_VALUE, (firstNameSnapshot) => {
      this.setState({ firstName: firstNameSnapshot.val() });
    });
  }

  render() {
    return (
      <div>
        <h1>Welcome to Lumi, {this.state.firstName}!</h1>
        Before we begin, you must either create or join a Lumi Group.
        <GroupCreateComponent />
        <br />
        Or
        <br />
        <GroupJoinComponent />
      </div>
    );
  }
}

export default NewUserComponent;
