import * as firebase from 'firebase';

import * as constants from '../static/constants';


export const categoryCodeToName = (categoryCode) => {
  switch (categoryCode) {
    case constants.TIMELINE_CATEGORY_CODE_ALL:
      return constants.TIMELINE_CATEGORY_NAME_ALL;
    case constants.TIMELINE_CATEGORY_CODE_ACTIVITY:
      return constants.TIMELINE_CATEGORY_NAME_ACTIVITY;
    case constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR:
      return constants.TIMELINE_CATEGORY_NAME_BEHAVIOUR;
    case constants.TIMELINE_CATEGORY_CODE_MOOD:
      return constants.TIMELINE_CATEGORY_NAME_MOOD;
    case constants.TIMELINE_CATEGORY_CODE_MEMORY:
      return constants.TIMELINE_CATEGORY_NAME_MEMORY;
    case constants.TIMELINE_CATEGORY_CODE_MEDICAL:
      return constants.TIMELINE_CATEGORY_NAME_MEDICAL;
    case constants.TIMELINE_CATEGORY_CODE_CAREGIVER:
      return constants.TIMELINE_CATEGORY_NAME_CAREGIVER;
    case constants.TIMELINE_CATEGORY_CODE_OTHER:
      return constants.TIMELINE_CATEGORY_NAME_OTHER;
    default:
      return 'NA';
  }
};

/**
 * 1) Update a user record to reference the new group
 * 2) If this is a user's first group, mark all of their existing messages to belong to the group
 */
export const addUserToGroup = async (gid) => {
  const db = firebase.database();
  const userRef = db.ref(`${constants.DB_PATH_USERS}/${firebase.auth().currentUser.uid}`);

  // Update activeGid in user record to be current group ID
  // Add group ID to groups list in user record (gid: true)
  await userRef.update({
    activeGid: gid,
    [`groups/${gid}`]: true,
  });

  // Return if this is not the user's first group
  const userGroupsSnapshot = await userRef.child('groups').once(constants.DB_EVENT_NAME_VALUE);
  if (Object.keys(userGroupsSnapshot.val()).length > 1) {
    return;
  }

  // If the user has no PSID, they have not used Lumi Chat, thus have no messages yet
  const psidSnapshot = await userRef.child('psid').once(constants.DB_EVENT_NAME_VALUE);
  const psid = psidSnapshot.val();
  if (!psid) {
    return;
  }

  // Access user messages
  const userMessagesRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES_USER}/${psid}`);
  const userMessagesSnapshot = await userMessagesRef.once(constants.DB_EVENT_NAME_VALUE);
  const userMessages = userMessagesSnapshot.val();

  // Return if the user has no messages yet
  if (!userMessages) {
    return;
  }

  // Copy all user message references to the group
  await db.ref(`${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${gid}`).update({ ...userMessages });

  // Update each of the user's messages to reference the new GID
  const messageUpdates = {};
  Object.keys(userMessages).forEach((messageKey) => {
    messageUpdates[`${messageKey}/gid`] = gid;
  });
  await db.ref(constants.DB_PATH_LUMI_MESSAGES).update(messageUpdates);
};
