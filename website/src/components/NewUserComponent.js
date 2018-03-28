import * as firebase from 'firebase';
import React, { Component } from 'react';

import GroupJoinComponent from './GroupJoinComponent';
import GroupCreateContainer from '../containers/GroupCreateContainer';
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
    const firstNameRef = firebase.database().ref(`${constants.DB_PATH_USERS}/${uid}/firstName`);
    firstNameRef.once(constants.DB_EVENT_NAME_VALUE, (firstNameSnapshot) => {
      this.setState({ firstName: firstNameSnapshot.val() });
    });
  }

  render() {
    return (
      <div>
        <h1>{`${constants.NEW_USER_PAGE_TITLE}${this.state.firstName}!`}</h1>
        {constants.NEW_USER_PAGE_SUBTITLE}
        <GroupCreateContainer />
        <br />
        Or
        <br />
        <GroupJoinComponent />
      </div>
    );
  }
}

export default NewUserComponent;
