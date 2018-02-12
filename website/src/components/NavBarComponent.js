import * as firebase from 'firebase';
import React, { Component } from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import * as constants from '../static/constants';


class NavBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: '',
      groupName: '',
    };

    // Populate Group ID and Group Name in navbar with auth user's group information
    const db = firebase.database();
    const authUid = firebase.auth().currentUser.uid;
    const activeGidRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGid`);
    activeGidRef.on(constants.DB_EVENT_NAME_VALUE, (activeGidSnapshot) => {
      const activeGid = activeGidSnapshot.val();
      // If active GID not set, auth user does not belong to a group yet
      if (!activeGid) {
        return;
      }
      activeGidRef.off();

      // Get group information from DB
      const groupRef = firebase.database().ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGid}`);
      groupRef.once(constants.DB_EVENT_NAME_VALUE, (groupSnapshot) => {
        const groupName = groupSnapshot.val().name;
        this.setState({
          ...this.state,
          groupId: activeGid,
          groupName,
        });
      });
    });
  }

  render() {
    let groupInfo;
    if (this.state.groupId !== '') {
      groupInfo = (
        <Navbar.Text pullRight>
          Group ID: {this.state.groupId}
          Group Name: {this.state.groupName}
        </Navbar.Text>
      );
    }

    return (
      <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Lumi</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="/">
              Timeline
            </NavItem>
          </Nav>
          {groupInfo}
          <Nav pullRight>
            <NavItem eventKey={1} onClick={() => firebase.auth().signOut()}>
              Sign Out
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBarComponent;
