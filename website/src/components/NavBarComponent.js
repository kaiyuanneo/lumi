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
    const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
    activeGroupRef.on(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
      const activeGroup = activeGroupSnapshot.val();
      // If active group not set, auth user does not belong to a group yet
      if (!activeGroup) {
        return;
      }
      activeGroupRef.off();

      // Get group information from DB
      const groupRef = firebase.database().ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroup}`);
      groupRef.once(constants.DB_EVENT_NAME_VALUE, (groupSnapshot) => {
        this.setState({
          ...this.state,
          groupId: activeGroup,
          groupName: groupSnapshot.val().name,
        });
      });
    });
  }

  render() {
    // If user has not joined a group yet, do not display groupName and groupId in navbar
    let groupNameLabel;
    if (this.state.groupName) {
      groupNameLabel = ` ${this.state.groupName}`;
    }
    let groupIdLabel;
    if (this.state.groupId) {
      groupIdLabel = (
        <Navbar.Text pullRight>
          {constants.NAVBAR_ITEM_GROUP_ID}{this.state.groupId}
        </Navbar.Text>
      );
    }
    return (
      <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/"><b>{constants.NAVBAR_HEADER_TITLE}</b>{groupNameLabel}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="/">
              {constants.NAVBAR_ITEM_TIMELINE}
            </NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} onClick={() => firebase.auth().signOut()}>
              {constants.NAVBAR_ITEM_SIGN_OUT}
            </NavItem>
          </Nav>
          {groupIdLabel}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBarComponent;
