import * as firebase from 'firebase';
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import CareCardSelectCareRecipientComponent from '../components/CareCardSelectCareRecipientComponent';
import * as constants from '../static/constants';


const mapStateToProps = (state) => {
  const memberList = [];
  // First option in select menu is unspecified
  memberList.push((
    <option
      key={constants.CARE_CARD_CODE_UNSPECIFIED}
      value={constants.CARE_CARD_CODE_UNSPECIFIED}
    >
      {constants.CARE_CARD_NAME_UNSPECIFIED}
    </option>
  ));
  memberList.push(...[...state.careCard.selectCrMembers.keys()].map(memberId => (
    <option key={memberId} value={memberId}>
      {state.careCard.selectCrMembers.get(memberId)}
    </option>
  )));
  // Include New Member option in select menu
  memberList.push((
    <option
      key={constants.CARE_CARD_CR_CODE_NEW_MEMBER}
      value={constants.CARE_CARD_CR_CODE_NEW_MEMBER}
    >
      {constants.CARE_CARD_CR_NAME_NEW_MEMBER}
    </option>
  ));
  return {
    memberList,
    selectedMember: state.careCard.selectCrSelectedMember,
    isSelectButtonDisabled:
      state.careCard.selectCrSelectedMember === '' ||
      state.careCard.selectCrSelectedMember === constants.CARE_CARD_CODE_UNSPECIFIED,
    shouldRenderNewMemberForm:
      state.careCard.selectCrSelectedMember === constants.CARE_CARD_CR_CODE_NEW_MEMBER &&
      // Do not render new member form until user clicks Select
      state.careCard.selectCrUserClickedSelect,
  };
};

const mapDispatchToProps = dispatch => ({
  updateSelectedMember: e => dispatch(actions.updateSelectCrSelectedMember(e.target.value)),
  toggleUserClickedSelect: () => dispatch(actions.toggleSelectCrUserClickedSelect()),
  updateMembers: members => dispatch(actions.updateSelectCrGroupMembers(members)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  fetchGroupMembers: async () => {
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
    memberIdsSnapshot.forEach((memberIdSnapshot) => {
      const memberId = memberIdSnapshot.key;
      const memberRef = db.ref(`${constants.DB_PATH_USERS}/${memberId}`);
      memberRef.once(constants.DB_EVENT_NAME_VALUE, (memberSnapshot) => {
        const member = memberSnapshot.val();
        members.set(memberId, `${member.firstName} ${member.lastName}`);
        // Inefficient to update members with each iteration, but am lazy to figure out
        // how to await all iterations before updating members.
        // Updating members needs to happen in callback, otherwise saved members may be empty
        dispatchProps.updateMembers(members);
      });
    });
  },
  handleClickSelect: () => {
    // Record that user clicked select so that Lumi can control when React should re-render
    dispatchProps.toggleUserClickedSelect();
    // React will manage next steps if user chooses to create a New Member
    if (stateProps.selectedMember === constants.CARE_CARD_CR_CODE_NEW_MEMBER) {
      return;
    }
    // Set active care recipient of current group to be the selected member
    const db = firebase.database();
    const authUid = firebase.auth().currentUser.uid;
    const activeGroupIdRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
    activeGroupIdRef.once(constants.DB_EVENT_NAME_VALUE, (activeGroupIdSnapshot) => {
      db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupIdSnapshot.val()}`).update({
        activeCareRecipient: stateProps.selectedMember,
      });
    });
  },
});

const CareCardSelectCareRecipientContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CareCardSelectCareRecipientComponent);

export default CareCardSelectCareRecipientContainer;
