// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import CareProfileSelectCareRecipientComponent from '../components/CareProfileSelectCareRecipientComponent';
import * as constants from '../static/constants';


export const _getMemberList = (state) => {
  const memberList = [];
  // First option in select menu is unspecified
  memberList.push((
    <option
      key={constants.CARE_PROFILE_CODE_UNSPECIFIED}
      value={constants.CARE_PROFILE_CODE_UNSPECIFIED}
    >
      {constants.CARE_PROFILE_NAME_UNSPECIFIED}
    </option>
  ));
  memberList.push(...[...state.careProfile.selectCrMembers.keys()].map(memberId => (
    <option key={memberId} value={memberId}>
      {state.careProfile.selectCrMembers.get(memberId)}
    </option>
  )));
  // Include New Member option in select menu
  memberList.push((
    <option
      key={constants.CARE_PROFILE_CR_CODE_NEW_MEMBER}
      value={constants.CARE_PROFILE_CR_CODE_NEW_MEMBER}
    >
      {constants.CARE_PROFILE_CR_NAME_NEW_MEMBER}
    </option>
  ));
  return memberList;
};


const mapStateToProps = state => ({
  memberList: _getMemberList(state),
  selectedMember: state.careProfile.selectCrSelectedMember,
  isSelectButtonDisabled:
    state.careProfile.selectCrSelectedMember === '' ||
    state.careProfile.selectCrSelectedMember === constants.CARE_PROFILE_CODE_UNSPECIFIED,
  shouldRenderNewMemberForm:
    state.careProfile.selectCrSelectedMember === constants.CARE_PROFILE_CR_CODE_NEW_MEMBER &&
    // Do not render new member form until user clicks Select
    state.careProfile.selectCrUserClickedSelect,
});


const mapDispatchToProps = dispatch => ({
  updateSelectedMember: e => dispatch(actions.updateSelectCrSelectedMember(e.target.value)),
  toggleUserClickedSelect: () => dispatch(actions.toggleSelectCrUserClickedSelect()),
  updateMembers: members => dispatch(actions.updateSelectCrGroupMembers(members)),
});


export const _fetchGroupMembers = async (dispatchProps) => {
  // Get group member info from DB
  const db = firebase.database();
  const authUid = firebase.auth().currentUser.uid;
  const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  const activeGroupSnapshot = await activeGroupRef.once(constants.DB_EVENT_NAME_VALUE);
  const memberIdsRef =
    db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupSnapshot.val()}/members`);
  const memberIdsSnapshot = await memberIdsRef.once(constants.DB_EVENT_NAME_VALUE);
  const members = new Map();
  // Add <memberId>: <fullName> entries to the members list for each member in the group
  // Store member IDs in a separate array because cannot index into member ID snapshot in 2nd loop
  const memberIds = [];
  const memberSnapshotPromises = [];
  // For some reason iterating over memberIdsSnapshot in a for (let i = 0...) loop does not work
  memberIdsSnapshot.forEach((memberIdSnapshot) => {
    memberIds.push(memberIdSnapshot.key);
    const memberRef = db.ref(`${constants.DB_PATH_USERS}/${memberIdSnapshot.key}`);
    memberSnapshotPromises.push(memberRef.once(constants.DB_EVENT_NAME_VALUE));
  });
  const memberSnapshots = await Promise.all(memberSnapshotPromises);
  for (let i = 0; i < memberSnapshots.length; i += 1) {
    const member = memberSnapshots[i].val();
    members.set(memberIds[i], `${member.firstName} ${member.lastName}`);
  }
  dispatchProps.updateMembers(members);

  // Return members for unit test
  return members;
};


export const _handleClickSelect = async (stateProps, dispatchProps) => {
  // Record that user clicked select so that Lumi can control when React should re-render
  dispatchProps.toggleUserClickedSelect();
  // React will manage next steps if user chooses to create a New Member
  if (stateProps.selectedMember === constants.CARE_PROFILE_CR_CODE_NEW_MEMBER) {
    return;
  }
  // Set active care recipient of current group to be the selected member
  const db = firebase.database();
  const authUid = firebase.auth().currentUser.uid;
  const activeGroupIdRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  const activeGroupIdSnapshot = await activeGroupIdRef.once(constants.DB_EVENT_NAME_VALUE);
  db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupIdSnapshot.val()}`).update({
    activeCareRecipient: stateProps.selectedMember,
  });
};


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  fetchGroupMembers: () => _fetchGroupMembers(dispatchProps),
  handleClickSelect: () => _handleClickSelect(stateProps, dispatchProps),
});


const CareProfileSelectCareRecipientContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CareProfileSelectCareRecipientComponent);

export default CareProfileSelectCareRecipientContainer;
