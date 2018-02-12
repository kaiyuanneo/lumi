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
    const activeGidRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGid`);
    activeGidRef.on(constants.DB_EVENT_NAME_VALUE, (activeGidSnapshot) => {
      const activeGid = activeGidSnapshot.val();
      // If active GID not set, auth user does not belong to a group.
      if (!activeGid) {
        this.setState({
          ...this.state,
          isAuthUserInGroup: false,
        });
        return;
      }
      // Remove listener once user has activeGid because there is no way to leave all groups
      activeGidRef.off();
      this.setState({
        ...this.state,
        isAuthUserInGroup: true,
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
