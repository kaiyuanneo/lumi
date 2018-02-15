import * as firebase from 'firebase';
import React, { Component } from 'react';

import NavBarComponent from './NavBarComponent';
import NewUserComponent from './NewUserComponent';
import TimelineComponent from './TimelineComponent';
import * as constants from '../static/constants';


class HomeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthUserInGroup: null,
    };

    const db = firebase.database();
    const authUid = firebase.auth().currentUser.uid;
    const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
    activeGroupRef.on(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
      // If active group not set, auth user does not belong to a group.
      let isAuthUserInGroup = false;
      if (activeGroupSnapshot.val()) {
        // Remove listener once user has activeGroup because there is no way to leave all groups
        activeGroupRef.off();
        isAuthUserInGroup = true;
      }
      this.setState({
        ...this.state,
        isAuthUserInGroup,
      });
    });
  }

  render() {
    // Do not render anything before we know if auth user is in a group
    const { isAuthUserInGroup } = this.state;
    if (isAuthUserInGroup === null) {
      return null;
    }
    const contentComponent = isAuthUserInGroup ? <TimelineComponent /> : <NewUserComponent />;
    return (
      <div className="navbar-offset">
        <NavBarComponent />
        {contentComponent}
      </div>
    );
  }
}

export default HomeComponent;
