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
    // If user has not joined a group yet, do not display groupName and groupId in navbar
    groupIdLabel,
    groupNameLabel,
  };
};


export const _saveAuthUserGroupInfo = async (dispatch, activeGroupRef, activeGroupSnapshot) => {
  const activeGroup = activeGroupSnapshot.val();
  // If active group not set, auth user does not belong to a group yet
  if (!activeGroup) {
    return;
  }
  // Turn off this listener once auth user is in a group
  activeGroupRef.off();
  // Get group information from DB
  const groupRef = firebase.database().ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroup}`);
  const groupSnapshot = await groupRef.once(constants.DB_EVENT_NAME_VALUE);
  dispatch(actions.saveAuthUserGroupInfo(activeGroup, groupSnapshot.val().name));
};


export const _getGroupInfo = (dispatch) => {
  // Populate Group ID and Group Name in navbar with auth user's group information
  const db = firebase.database();
  const authUid = firebase.auth().currentUser.uid;
  const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  activeGroupRef.on(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
    _saveAuthUserGroupInfo(dispatch, activeGroupRef, activeGroupSnapshot);
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
