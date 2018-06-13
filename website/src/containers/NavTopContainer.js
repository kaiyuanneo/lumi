// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';
import NavTopComponent from '../components/NavTopComponent';
import * as constants from '../static/constants';


const mapStateToProps = (state) => {
  let groupIdLabel = null;
  let groupNameLabel = null;
  if (state.group.groupId) {
    groupIdLabel = `${constants.NAVBAR_ITEM_GROUP_ID}${state.group.groupId}`;
  }
  if (state.group.groupName) {
    groupNameLabel = ` ${state.group.groupName}`;
  }
  return {
    groups: state.group.groups,
    activeGroupId: state.group.groupId,
    // If user has not joined a group yet, do not display groupName and groupId in navbar
    groupIdLabel,
    groupNameLabel,
    careRecipientUid: state.careProfile.uid,
    // Disable copy button on mobile devices because document.execCommand does not work.
    // Use window width as a proxy for whether devices are mobile or not.
    disableCopyButton: state.home.windowWidth < constants.WINDOW_WIDTH_MAX,
  };
};


export const _getGroupName = async (groupId) => {
  // Get group information from DB
  const groupRef = firebase.database().ref(`${constants.DB_PATH_LUMI_GROUPS}/${groupId}`);
  const groupSnapshot = await groupRef.once(constants.DB_EVENT_NAME_VALUE);
  return groupSnapshot.val().name;
};


export const _saveAuthUserActiveGroupInfo = async (dispatch, groupIdSnapshot) => {
  const activeGroupId = groupIdSnapshot.val();
  // If active group not set, auth user does not belong to a group yet
  if (!activeGroupId) {
    return;
  }
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
    _saveAuthUserActiveGroupInfo(dispatch, activeGroupSnapshot);
  });
};


const mapDispatchToProps = dispatch => ({
  getGroupInfo: () => _getGroupInfo(dispatch),
  switchGroup: groupId => dispatch(actions.switchGroup(groupId)),
  createOrJoinGroup: () =>
    dispatch(actions.saveCurrentProductCode(constants.PRODUCT_CODE_ADD_GROUP)),
});


export const _copyGroupId = (stateProps) => {
  const tempInput = document.createElement('input');
  tempInput.style = 'position: absolute; left: -1000px; top: -1000px';
  tempInput.value = stateProps.activeGroupId;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
};

export const _handleNavSelect = async (eventKey, stateProps, dispatchProps) => {
  if (eventKey.startsWith(constants.PRODUCT_CODE_SELECT_GROUP)) {
    const db = firebase.database();
    // Turn off listener on current care recipient
    db.ref(`${constants.DB_PATH_USERS}/${stateProps.careRecipientUid}`).off();
    // Get group ID from event key
    const groupId = eventKey.split(constants.PRODUCT_CODE_SELECT_GROUP)[1];
    // Switch group locally
    dispatchProps.switchGroup(groupId);
    // Switch group in Firebase
    // Timeline, Summary, and Care Profile automatically update from listeners on activeGroup
    const authUid = firebase.auth().currentUser.uid;
    db.ref(`${constants.DB_PATH_USERS}/${authUid}`).update({ activeGroup: groupId });
  } else if (eventKey === constants.PRODUCT_CODE_COPY_GROUP_ID) {
    _copyGroupId(stateProps);
  } else if (eventKey === constants.PRODUCT_CODE_CREATE_OR_JOIN_GROUP) {
    dispatchProps.createOrJoinGroup();
  } else if (eventKey === constants.PRODUCT_CODE_SIGN_OUT) {
    firebase.auth().signOut();
  }
};


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  handleNavSelect: eventKey => _handleNavSelect(eventKey, stateProps, dispatchProps),
  copyGroupId: () => _copyGroupId(stateProps),
});


const NavTopContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(NavTopComponent);

export default NavTopContainer;
