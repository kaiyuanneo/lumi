import * as firebase from 'firebase';
import React from 'react';
import { Tab } from 'react-bootstrap';

import * as constants from '../static/constants';


export const categoryCodeToName = (categoryCode) => {
  switch (categoryCode) {
    case constants.CARE_CARD_CATEGORY_CODE_BASIC:
      return constants.CARE_CARD_CATEGORY_NAME_BASIC;
    case constants.CARE_CARD_CATEGORY_CODE_MEDICAL:
      return constants.CARE_CARD_CATEGORY_NAME_MEDICAL;
    case constants.CARE_CARD_CATEGORY_CODE_CARE:
      return constants.CARE_CARD_CATEGORY_NAME_CARE;
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

  // Update activeGroup in user record to be current group ID
  // Add group ID to groups list in user record (gid: true)
  await userRef.update({
    activeGroup: gid,
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
    messageUpdates[`${messageKey}/group`] = gid;
  });
  await db.ref(constants.DB_PATH_LUMI_MESSAGES).update(messageUpdates);
};

/**
 * Get tab component for timeline and care card products
 */
export const getTabComponent = categoryCode => (
  <Tab
    eventKey={categoryCode}
    title={categoryCodeToName(categoryCode)}
  />
);

/**
 * Convert gender code to name
 * Currently this only uppercases the first letter, but will be more complex with other languages
 */
export const genderCodeToName = genderCode =>
  genderCode.charAt(0).toUpperCase() + genderCode.slice(1);

/**
 * Convert type of dementia code to name
 * Currently this only uppercases the first letter, but will be more complex with other languages
 */
export const dementiaCodeToName = (dementiaCode) => {
  switch (dementiaCode) {
    case constants.CARE_CARD_DEMENTIA_CODE_ALZHEIMERS:
      return constants.CARE_CARD_DEMENTIA_NAME_ALZHEIMERS;
    case constants.CARE_CARD_DEMENTIA_CODE_VASCULAR:
      return constants.CARE_CARD_DEMENTIA_NAME_VASCULAR;
    case constants.CARE_CARD_DEMENTIA_CODE_LEWY:
      return constants.CARE_CARD_DEMENTIA_NAME_LEWY;
    case constants.CARE_CARD_DEMENTIA_CODE_FRONTOTEMPORAL:
      return constants.CARE_CARD_DEMENTIA_NAME_FRONTOTEMPORAL;
    case constants.CARE_CARD_DEMENTIA_CODE_CREUTZFELDT_JAKOB:
      return constants.CARE_CARD_DEMENTIA_NAME_CREUTZFELDT_JAKOB;
    case constants.CARE_CARD_DEMENTIA_CODE_WERNICKE_KORSAKOFF:
      return constants.CARE_CARD_DEMENTIA_NAME_WERNICKE_KORSAKOFF;
    case constants.CARE_CARD_DEMENTIA_CODE_MIXED:
      return constants.CARE_CARD_DEMENTIA_NAME_MIXED;
    case constants.CARE_CARD_DEMENTIA_CODE_OTHER:
      return constants.CARE_CARD_DEMENTIA_NAME_OTHER;
    case constants.CARE_CARD_DEMENTIA_CODE_UNKNOWN:
      return constants.CARE_CARD_DEMENTIA_NAME_UNKNOWN;
    default:
      return 'Undefined';
  }
};

/**
 * Convert US date format (MM/DD/YYYY, used by Facebook) to ISO date format
 */
export const usToIsoDate = (usDate) => {
  const dateComponents = usDate.split('/');
  const year = parseInt(dateComponents[2], 10);
  // Javascript Date month attribute is 0-indexed
  const month = parseInt(dateComponents[0], 10) - 1;
  const day = parseInt(dateComponents[1], 10);
  return new Date(Date.UTC(year, month, day)).toISOString();
};

