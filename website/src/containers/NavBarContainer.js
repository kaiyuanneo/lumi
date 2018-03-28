import * as firebase from 'firebase';
import React from 'react';
import { connect } from 'react-redux';
import { Navbar } from 'react-bootstrap';

import * as actions from '../actions';
import NavBarComponent from '../components/NavBarComponent';
import * as constants from '../static/constants';


const mapStateToProps = (state) => {
  let groupIdLabel = state.home.groupId;
  let groupNameLabel = state.home.groupName;
  if (groupIdLabel) {
    groupIdLabel = (
      <Navbar.Text pullRight>
        {constants.NAVBAR_ITEM_GROUP_ID}{state.home.groupId}
      </Navbar.Text>
    );
  }
  if (groupNameLabel) {
    groupNameLabel = ` ${state.home.groupName}`;
  }
  return {
    // If user has not joined a group yet, do not display groupName and groupId in navbar
    groupIdLabel,
    groupNameLabel,
  };
};

const mapDispatchToProps = dispatch => ({
  getGroupInfo: () => {
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
      // Turn off this listener once auth user is in a group
      activeGroupRef.off();
      // Get group information from DB
      const groupRef = db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroup}`);
      groupRef.once(constants.DB_EVENT_NAME_VALUE, (groupSnapshot) => {
        dispatch(actions.saveAuthUserGroupInfo(activeGroup, groupSnapshot.val().name));
      });
    });
  },
  switchProduct: (eventKey) => {
    // Clicking sign out will trigger this because it is a child of the navbar
    if (eventKey === constants.PRODUCT_CODE_SIGN_OUT) {
      return;
    }
    // Event keys are product codes
    dispatch(actions.saveCurrentProductCode(eventKey));
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  signOut: () => firebase.auth().signOut(),
});

const NavBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(NavBarComponent);

export default NavBarContainer;
