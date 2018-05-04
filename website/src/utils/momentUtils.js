// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';

import * as actions from '../actions';
import * as constants from '../static/constants';


export const _saveTimelineMessage = async (dispatch, messageSnapshot) => {
  // Store message locally and add message sender's name to local state
  const message = messageSnapshot.val();
  // There should always be a relevant entry in user-psid-to-uid because in order to have
  // their message referenced by a group, a user must have signed into lumicares.
  const db = firebase.database();
  const uidRef = db.ref(`${constants.DB_PATH_USER_PSID_TO_UID}/${message.senderPsid}`);
  const uidSnapshot = await uidRef.once(constants.DB_EVENT_NAME_VALUE);
  const userRef = db.ref(`${constants.DB_PATH_USERS}/${uidSnapshot.val()}`);
  const userSnapshot = await userRef.once(constants.DB_EVENT_NAME_VALUE);
  const user = userSnapshot.val();
  const updatedMessage = {
    [messageSnapshot.key]: {
      ...message,
      senderFirstName: user.firstName,
      senderLastName: user.lastName,
      senderProfilePic: user.profilePic,
    },
  };
  dispatch(actions.saveTimelineMessage(updatedMessage));
};


/**
 * Sync a message's value and sender name locally and sync any time its value changes
 */
export const _saveMessageLocally = (dispatch, groupMessageSnapshot) => {
  const db = firebase.database();
  const messageRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES}/${groupMessageSnapshot.key}`);
  messageRef.on(constants.DB_EVENT_NAME_VALUE, (messageSnapshot) => {
    _saveTimelineMessage(dispatch, messageSnapshot);
  });
};


export const _saveGroupMessagesLocally = async (dispatch, activeGroupSnapshot) => {
  // Wait until auth user active group is populated before listening on group messages
  const authUserActiveGroup = activeGroupSnapshot.val();
  if (!authUserActiveGroup) {
    return;
  }
  // Listen on auth user's active group's messages to update local state when messages change
  const groupMessagesRef =
    firebase.database().ref(`${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${authUserActiveGroup}`);
  // Save numMessages so that Timeline and Summary know when and what to render
  const groupMessagesSnapshot = await groupMessagesRef.once(constants.DB_EVENT_NAME_VALUE);
  dispatch(actions.saveNumMessages(groupMessagesSnapshot.numChildren()));
  groupMessagesRef.on(constants.DB_EVENT_NAME_CHILD_ADDED, (groupMessageSnapshot) => {
    _saveMessageLocally(dispatch, groupMessageSnapshot);
  });
  groupMessagesRef.on(constants.DB_EVENT_NAME_CHILD_REMOVED, (message) => {
    dispatch(actions.deleteTimelineMessage(message));
  });
};


/**
 * Sync messages from user's active group to local state
 */
export const syncMessages = (dispatch) => {
  const db = firebase.database();
  const authUid = firebase.auth().currentUser.uid;
  // Listen on auth user activeGroup to determine when it has been populated
  const authUserActiveGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  authUserActiveGroupRef.on(constants.DB_EVENT_NAME_VALUE, (authUserActiveGroupSnapshot) => {
    _saveGroupMessagesLocally(dispatch, authUserActiveGroupSnapshot);
  });
};
