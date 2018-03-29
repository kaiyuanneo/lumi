import * as firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';
import TimelineComponent from '../components/TimelineComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


const mapStateToProps = (state) => {
  const sortedMessageKeys = Object.keys(state.timeline.messages).sort().reverse();
  const sortedMessageMap = new Map();
  for (let i = 0; i < sortedMessageKeys.length; i += 1) {
    sortedMessageMap.set(sortedMessageKeys[i], state.timeline.messages[sortedMessageKeys[i]]);
  }
  return {
    // Order messages in descending order with newest messages first
    // We cannot depend on messages to come in order from realtime database because it takes
    // varying amounts of time to look up user information for the sender of each message.
    sortedMessages: sortedMessageMap,
    shouldRenderMessage: (message) => {
      if (!message.showInTimeline) {
        return false;
      }
      if (state.timeline.messageFilterCategory === constants.TIMELINE_CATEGORY_CODE_ALL) {
        return true;
      }
      if (message.category === state.timeline.messageFilterCategory) {
        return true;
      }
      return false;
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  // Sync a message's value and sender name locally and sync any time its value changes
  const saveMessageLocally = (groupMessageSnapshot) => {
    const db = firebase.database();
    const messageRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES}/${groupMessageSnapshot.key}`);
    messageRef.on(constants.DB_EVENT_NAME_VALUE, async (messageSnapshot) => {
      // Store message locally and add message sender's name to local state
      const message = messageSnapshot.val();
      // There should always be a relevant entry in user-psid-to-uid because in order to have
      // their message referenced by a group, a user must have signed into lumicares.
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
        },
      };
      dispatch(actions.saveTimelineMessage(updatedMessage));
    });
  };
  const deleteMessageLocally = message => dispatch(actions.deleteTimelineMessage(message));
  return {
    // Sync local message state with auth user message state in Firebase
    syncMessages: () => {
      const db = firebase.database();
      const authUid = firebase.auth().currentUser.uid;
      // Listen on auth user activeGroup to determine when it has been populated
      const authUserActiveGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
      authUserActiveGroupRef.on(constants.DB_EVENT_NAME_VALUE, (authUserActiveGroupSnapshot) => {
        // Wait until auth user active group is populated before listening on group messages
        const authUserActiveGroup = authUserActiveGroupSnapshot.val();
        if (!authUserActiveGroup) {
          return;
        }
        // Turn off listener on auth user activeGroup once auth user activeGroup is populated
        authUserActiveGroupRef.off();
        // Listen on auth user's active group's messages to update local state when messages change
        const groupMessagesRef =
          db.ref(`${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${authUserActiveGroup}`);
        groupMessagesRef.on(constants.DB_EVENT_NAME_CHILD_ADDED, saveMessageLocally);
        groupMessagesRef.on(constants.DB_EVENT_NAME_CHILD_REMOVED, deleteMessageLocally);
      });
    },
    filterMessages: category => dispatch(actions.saveTimelineMessageFilterCategory(category)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getCategoryName: categoryCode => utils.categoryCodeToName(categoryCode),
  getLocalDateString: timestamp => utils.getLocalDateString(timestamp),
});

const TimelineContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(TimelineComponent);

export default TimelineContainer;
