// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';
import CareProfileComponent from '../components/CareProfileComponent';
import * as constants from '../static/constants';


const mapStateToProps = state => ({
  infoCategory: state.careProfile.infoCategory,
  fetched: state.careProfile.fetched,
  uid: state.careProfile.uid,
  fullName: `${state.careProfile.firstName} ${state.careProfile.lastName}`,
  profilePic: state.careProfile.profilePic,
});


/**
 * Handle care recipient
 * Separated from _getCareRecipient for testing
 */
export const _handleCareRecipient = (dispatch, careRecipientUidRef, careRecipientUidSnapshot) => {
  // Tell the component it is ok to render the new care recipient page if the group has no
  // care recipient. Otherwise, render the CareProfile. Do not render anything if Lumi
  // has not finished fetching the active care recipient of this group.
  dispatch(actions.saveFetchedCareRecipient());
  const careRecipientUid = careRecipientUidSnapshot.val();
  if (!careRecipientUid) {
    return;
  }
  // Update state with UID here so that if there is an active care recipient, render()
  // knows not to render the select care recipient component.
  dispatch(actions.saveCareRecipientUid(careRecipientUid));
  // Care recipient UID never changes, so we can turn off the reference after we retrieve it
  careRecipientUidRef.off();
  // Listen for changes in the active care recipient record and update state accordingly
  const db = firebase.database();
  const careRecipientRef = db.ref(`${constants.DB_PATH_USERS}/${careRecipientUid}`);
  careRecipientRef.on(constants.DB_EVENT_NAME_VALUE, (careRecipientSnapshot) => {
    // Copy all fields to local state for brevity, even though we don't need all of them
    dispatch(actions.updateCareRecipient(careRecipientSnapshot.val()));
  });
};


/**
 * Get care recipient info from DB
 */
export const _getCareRecipient = async (dispatch) => {
  const db = firebase.database();
  const authUid = firebase.auth().currentUser.uid;
  const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  activeGroupRef.on(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
    // activeCareRecipient field in DB stores the UID of the currently active care recipient
    const careRecipientUidRef =
      db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupSnapshot.val()}/activeCareRecipient`);
    careRecipientUidRef.on(constants.DB_EVENT_NAME_VALUE, (careRecipientUidSnapshot) => {
      _handleCareRecipient(dispatch, careRecipientUidRef, careRecipientUidSnapshot);
    });
  });
};


const mapDispatchToProps = dispatch => ({
  getCareRecipient: () => _getCareRecipient(dispatch),
});


const CareProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
)(CareProfileComponent);

export default CareProfileContainer;
