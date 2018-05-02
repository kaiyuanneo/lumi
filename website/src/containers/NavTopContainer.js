// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';
import NavTopComponent from '../components/NavTopComponent';
import * as constants from '../static/constants';


const mapStateToProps = (state) => {
  let groupIdLabel = null;
  let groupNameLabel = null;
  if (state.home.groupId) {
    groupIdLabel = `${constants.NAVBAR_ITEM_GROUP_ID}${state.home.groupId}`;
  }
  if (state.home.groupName) {
    groupNameLabel = ` ${state.home.groupName}`;
  }
  return {
    groups: state.home.groups,
    // If user has not joined a group yet, do not display groupName and groupId in navbar
    groupIdLabel,
    groupNameLabel,
  };
};


export const _getGroupName = async (groupId) => {
  // Get group information from DB
  const groupRef = firebase.database().ref(`${constants.DB_PATH_LUMI_GROUPS}/${groupId}`);
  const groupSnapshot = await groupRef.once(constants.DB_EVENT_NAME_VALUE);
  return groupSnapshot.val().name;
};


export const _saveAuthUserActiveGroupInfo = async (dispatch, groupRef, groupIdSnapshot) => {
  const activeGroupId = groupIdSnapshot.val();
  // If active group not set, auth user does not belong to a group yet
  if (!activeGroupId) {
    return;
  }
  // Turn off this listener once auth user is in a group
  groupRef.off();
  // Save active group info locally
  const activeGroupName = await _getGroupName(activeGroupId);
  dispatch(actions.saveAuthUserActiveGroupInfo(activeGroupId, activeGroupName));
};


export const _getGroupInfo = (dispatch) => {
  const db = firebase.database();
  const authUid = firebase.auth().currentUser.uid;
  // Populate switch groups dropdown in navbar with auth user's groups
  const groupsRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/groups`);
  groupsRef.on(constants.DB_EVENT_NAME_CHILD_ADDED, async (groupIdSnapshot) => {
    const groupId = groupIdSnapshot.key;
    const groupName = await _getGroupName(groupId);
    dispatch(actions.saveAuthUserGroupInfo(groupId, groupName));
  });
  // Populate Group ID and Group Name in navbar with auth user's group information
  const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  activeGroupRef.on(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
    _saveAuthUserActiveGroupInfo(dispatch, activeGroupRef, activeGroupSnapshot);
  });
};


const mapDispatchToProps = dispatch => ({
  getGroupInfo: () => _getGroupInfo(dispatch),
});


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  signOut: () => firebase.auth().signOut(),
});


const NavTopContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(NavTopComponent);

export default NavTopContainer;
