// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import CareCardComponent from '../components/CareCardComponent';
import CareCardBasicInfoComponent from '../components/CareCardBasicInfoComponent';
import CareCardMedicalInfoComponent from '../components/CareCardMedicalInfoComponent';
import CareCardCareInfoComponent from '../components/CareCardCareInfoComponent';
import * as constants from '../static/constants';


const mapStateToProps = (state) => {
  let contentComponent;
  switch (state.careCard.infoCategory) {
    case constants.CARE_CARD_CATEGORY_CODE_BASIC:
      contentComponent = <CareCardBasicInfoComponent />;
      break;
    case constants.CARE_CARD_CATEGORY_CODE_MEDICAL:
      contentComponent = <CareCardMedicalInfoComponent />;
      break;
    case constants.CARE_CARD_CATEGORY_CODE_CARE:
      contentComponent = <CareCardCareInfoComponent />;
      break;
    default:
      contentComponent = <CareCardBasicInfoComponent />;
  }
  return {
    infoCategory: state.careCard.infoCategory,
    fetched: state.careCard.fetched,
    uid: state.careCard.uid,
    firstName: state.careCard.firstName,
    lastName: state.careCard.lastName,
    profilePic: state.careCard.profilePic,
    contentComponent,
  };
};


/**
 * Get care recipient info from DB
 * Exported for testing
 */
export const _getCareRecipient = async (dispatch) => {
  const db = firebase.database();
  const authUid = firebase.auth().currentUser.uid;
  const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  const activeGroupSnapshot = await activeGroupRef.once(constants.DB_EVENT_NAME_VALUE);
  // activeCareRecipient field in DB stores the UID of the currently active care recipient
  const careRecipientUidRef =
    db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupSnapshot.val()}/activeCareRecipient`);
  const careRecipientUidSnapshot = await careRecipientUidRef.on(constants.DB_EVENT_NAME_VALUE);
  // Tell the component it is ok to render the new care recipient page if the group has no
  // care recipient. Otherwise, render the Care Card. Do not render anything if Lumi
  // has not finished fetching the active care recipient of this group.
  dispatch(actions.toggleFetchedCareRecipient());
  const careRecipientUid = careRecipientUidSnapshot.val();
  if (!careRecipientUid) {
    return;
  }
  // Update state with UID here so that if there is an active care recipient, render()
  // knows not to render the select care recipient component.
  dispatch(actions.saveCareRecipientUid(careRecipientUid));
  careRecipientUidRef.off();
  // Listen for changes in the active care recipient record and update state accordingly
  // TODO(kai): Remember to turn off this listener when we change care recipients
  const careRecipientRef = db.ref(`${constants.DB_PATH_USERS}/${careRecipientUid}`);
  const careRecipientSnapshot = await careRecipientRef.on(constants.DB_EVENT_NAME_VALUE);
  // Copy all fields to local state for brevity, even though we don't need all of them
  dispatch(actions.updateCareRecipient(careRecipientSnapshot.val()));
};


const mapDispatchToProps = dispatch => ({
  getCareRecipient: () => _getCareRecipient(dispatch),
  saveCareCardInfoCategory: category => dispatch(actions.saveCareCardInfoCategory(category)),
});


const CareCardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
)(CareCardComponent);

export default CareCardContainer;
