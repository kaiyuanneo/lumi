import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as rp from 'request-promise';
import { Md5 } from 'ts-md5/dist/md5';

import * as constants from '../static/constants';
import * as utils from '../utils';


/**
 * Boilerplate function for Messenger Platform to verify webhook authenticity
 */
export const verify = (req, res) => {
  console.log('Running function verify');
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === 'subscribe' && token === functions.config().lumi.token_verify) {
      // Respond with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};


/**
 * Get user PSID from ASID
 * NB: This function needs to happen server-side because we cannot expose Lumi's app access
 * token in the client
 */
export const getPsidFromAsid = async (req, res) => {
  console.log('Running function getPsidFromAsid');

  // Get PSIDs from FB Graph API
  const psidRequestOptions = {
    uri: `${constants.URL_FB_GRAPH_API}/${req.query.asid}`,
    qs: {
      fields: 'ids_for_pages',
      access_token: utils.getAppAccessToken(),
    },
    json: true,
  };
  const psidParsedBody = await rp(psidRequestOptions);

  // Get relevant PSID from psidParsedBody
  // If there is no relevant PSID, return psid: '' to client
  let psid = '';
  // If user has not used Lumi Chat, there may not be an ids_for_pages prop in psidParsedBody
  if (psidParsedBody.ids_for_pages) {
    psidParsedBody.ids_for_pages.data.forEach((pageInfo) => {
      if (pageInfo.page.id === constants.PAGE_ID_LUMI) {
        psid = pageInfo.id;
      }
    });
  }

  // Send PSID back to client
  // Set Access-Control-Allow-Origin header so Cloud Functions can respond to lumicares.com
  res.status(200).set('Access-Control-Allow-Origin', '*').json({ psid });
};


/**
 * Save image in message to Firebase storage. This is necessary because Messenger CDN image
 * links expire after an undefined period of time.
 * Assumes Lumi only receives image attachments.
 */
const saveImageToDb = async (originalImageUrl) => {
  console.log('Running function saveImageToDb');
  // Ignore empty URLs
  if (!originalImageUrl) {
    return '';
  }

  // Copy image to Firebase Storage
  const uploadOptions = { destination: `${Md5.hashStr(originalImageUrl)}.jpg` };
  const uploadResponse = await admin.storage().bucket().upload(originalImageUrl, uploadOptions);

  // Save the persistent image URL to the received message and return the updated message
  const signedUrlConfig = {
    action: 'read',
    // Ideally we would make this never expire, but Google Storage needs an expiry date
    expires: constants.DATE_IMAGE_EXPIRY,
  };
  const signedUrlResponse = await uploadResponse[0].getSignedUrl(signedUrlConfig);
  return signedUrlResponse[0];
};


/**
 * Wrap saveImageToDb to allow other Lumi modules to get a permanent image link
 */
export const getPermanentImageUrl = async (req, res) => {
  console.log('Running function getPermanentImageUrl');
  const permUrl = await saveImageToDb(req.body.tempUrl);
  // Set Access-Control-Allow-Origin header so Cloud Functions can respond to lumicares.com
  res.status(200).set('Access-Control-Allow-Origin', '*').json({ permUrl });
};


/**
 * Send response message via the Send API
 * Export for unit tests
 */
const callSendApi = async (senderPsid, response) => {
  console.log('Running function callSendApi');
  // Construct the message body
  const requestBody = {
    recipient: {
      id: senderPsid,
    },
    message: response,
  };

  // Construct request options
  const sendApiRequestOptions = {
    uri: constants.URL_FB_SEND_API,
    qs: { access_token: utils.getPageAccessToken() },
    method: 'POST',
    json: requestBody,
  };

  // Send HTTP request to Messenger Platform
  try {
    await rp(sendApiRequestOptions);
    console.log('Message response sent!');
  } catch (e) {
    console.error(`Unable to send message: ${e}`);
  }
};


/**
 * Send default message that should be the last message Lumi sends always
 */
const sendWelcomeMessage = async (senderPsid, firstName) => {
  const response = {
    text: `Hey ${firstName}! How are you and LO doing? Share a moment from today with me 😊`,
    quick_replies: [
      {
        title: 'Share moment',
        content_type: constants.QUICK_REPLY_CONTENT_TYPE_TEXT,
        // Save quickReply payload as JSON string because payload only supports string values
        payload: JSON.stringify({
          code: constants.RESPONSE_CODE_SHARE_MOMENT_YES,
        }),
      },
      {
        title: 'Maybe another time',
        content_type: constants.QUICK_REPLY_CONTENT_TYPE_TEXT,
        // Save quickReply payload as JSON string because payload only supports string values
        payload: JSON.stringify({
          code: constants.RESPONSE_CODE_SHARE_MOMENT_NO,
        }),
      }
    ],
  };

  await callSendApi(senderPsid, response);
};


/**
 * Get group name from DB given a group ID
 */
const getGroupNameFromGroupId = async (groupId) => {
  const db = admin.database();
  const groupNameRef = db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${groupId}/name`);
  return groupNameRef.once(constants.DB_EVENT_NAME_VALUE);
};


/**
 * Generate quick reply object for specific response
 */
const getQuickReply = async (
  messageRef,
  responseCode,
  groupId = null,
  // isOriginalMessageTest is only relevant for new messages where author belongs to multiple groups
  isOriginalMessageText = null,
) => ({
  // If quick reply involves group ID, look up and use group name as title.
  // Otherwise, get template quick reply title from utils.
  title: groupId ?
    await getGroupNameFromGroupId(groupId) :
    utils.responseCodeToQuickReplyTitle(responseCode),
  content_type: constants.QUICK_REPLY_CONTENT_TYPE_TEXT,
  // Save quickReply payload as JSON string because payload only supports string values
  payload: JSON.stringify({
    groupId,
    isOriginalMessageText,
    code: responseCode,
    messageKey: messageRef.key,
  }),
});


/**
 * Get response for a specific message type from Lumi Chat
 */
const getResponse = async (
  webhookEvent,
  receivedResponseCode,
  messageRef,
  // userGroups is only relevant when response code is NEW_MESSAGE
  userGroups = null,
  // isOriginalMessageText is only relevant when response code is CHOSE_GROUP
  isOriginalMessageText = null,
) => {
  console.log('Running function getResponse');
  const receivedMessage = webhookEvent.message;
  let quickReplies = null;
  // If user is in multiple groups, ask user which group to save the message to
  if (receivedResponseCode === constants.RESPONSE_CODE_NEW_MESSAGE && userGroups) {
    quickReplies = [];
    const responseCode = constants.RESPONSE_CODE_CHOSE_GROUP;
    const isMessageText = 'text' in receivedMessage;
    for (const groupId of userGroups) {
      quickReplies.push(await getQuickReply(messageRef, responseCode, groupId, isMessageText));
    }
  // If user is not in multiple groups or has just chosen group, ask user if they want to attach
  // If the original message contains text, provide option to attach image
  } else if (
    (receivedResponseCode === constants.RESPONSE_CODE_NEW_MESSAGE && 'text' in receivedMessage) ||
    (receivedResponseCode === constants.RESPONSE_CODE_CHOSE_GROUP && isOriginalMessageText)
  ) {
    quickReplies = [
      await getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_IMAGE_YES),
      await getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_IMAGE_NO),
    ];
  // If the original message contains image, provide option to attach text
  } else if (
    receivedResponseCode === constants.RESPONSE_CODE_NEW_MESSAGE ||
    receivedResponseCode === constants.RESPONSE_CODE_CHOSE_GROUP
  ) {
    quickReplies = [
      await getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_TEXT_YES),
      await getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_TEXT_NO),
    ];
  // Ask user to choose star
  } else if (
    receivedResponseCode === constants.RESPONSE_CODE_ATTACH_IMAGE_NO ||
    receivedResponseCode === constants.RESPONSE_CODE_ATTACH_TEXT_NO ||
    receivedResponseCode.indexOf('attached') >= 0
  ) {
    quickReplies = [
      await getQuickReply(messageRef, constants.RESPONSE_CODE_STAR_YES),
      await getQuickReply(messageRef, constants.RESPONSE_CODE_STAR_NO),
    ];
  // Ask user to choose category
  } else if (receivedResponseCode.indexOf('star') >= 0) {
    quickReplies = [
      await getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_ACTIVITY),
      await getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR),
      await getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MOOD),
      await getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MEMORY),
      await getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MEDICAL),
      await getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_CAREGIVER),
      await getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_OTHER),
    ];
  }
  return {
    text: await utils.responseCodeToResponseMessage(
      receivedResponseCode, webhookEvent, userGroups, isOriginalMessageText),
    quick_replies: quickReplies,
  };
};


/**
 * Update DB to reference new message by the given group.
 * Specifically, 1) update message to reference group ID, and 2) update relevant path in
 * lumi-group-messages to reference this message key.
 */
const saveMessageToGroup = (messageRef, groupId) => {
  // Store group ID in new message
  messageRef.update({ group: groupId });
  // Store new message key in lumi-messages-group path under the active group ID
  const db = admin.database();
  const groupMessagesRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${groupId}`);
  groupMessagesRef.update({ [messageRef.key]: true });
};


/**
 * Handle quick reply responses from Lumi user
 * Async because getResponse returns a promise
 */
const handleQuickReply = async (webhookEvent, messagesRef, userMessagesRef) => {
  console.log('Running function handleQuickReply');
  // Save quickReply payload as JSON string because payload only supports string values
  const quickReplyPayload = JSON.parse(webhookEvent.message.quick_reply.payload);
  const responseCode = quickReplyPayload.code;
  const groupId = quickReplyPayload.groupId;
  const isOriginalMessageText = quickReplyPayload.isOriginalMessageText;
  // Quick replies from the Get Started message do not have messageKey
  const messageKey = quickReplyPayload.messageKey;
  const messageRef = messageKey ? messagesRef.child(messageKey) : null;
  // If user chooses to save message to a group, update the message to reference the group
  if (responseCode === constants.RESPONSE_CODE_CHOSE_GROUP) {
    saveMessageToGroup(messageRef, groupId);
  // If user chooses to add attachment to prev message, set a flag to indicate this
  } else if (responseCode === constants.RESPONSE_CODE_ATTACH_IMAGE_YES) {
    userMessagesRef.update({ isAwaitingImage: true });
  } else if (responseCode === constants.RESPONSE_CODE_ATTACH_TEXT_YES) {
    userMessagesRef.update({ isAwaitingText: true });
  // Star message if user chooses to
  } else if (responseCode === constants.RESPONSE_CODE_STAR_YES) {
    messageRef.update({ starred: true });
  // If quick reply is about setting a message category, update message category
  } else if (responseCode.indexOf('category') >= 0) {
    messageRef.update({ category: utils.responseCodeToMessageCategoryCode(responseCode) });
  }
  // Generate response based on received response code
  return getResponse(webhookEvent, responseCode, messageRef, null, isOriginalMessageText);
};


/**
 * If current message should be attached to previous message, perform backend wiring to do so
 */
const attachToPrevMessage = async (
  messagesRef, userMessagesRef, receivedMessage, isAwaitingImage, isAwaitingText,
  isAwaitingImageRef, isAwaitingTextRef, defaultResponseCode, defaultShowInTimeline,
  defaultMessageRef,
) => {
  console.log('Running function attachToPrevMessage');
  let responseCode = defaultResponseCode;
  let showInTimeline = defaultShowInTimeline;
  let messageRef = defaultMessageRef;

  // Get prev message. Get last 3 entries to avoid the is-awaiting flags stored in same path
  const orderedUserMessagesRef = userMessagesRef.orderByKey().limitToLast(3);
  const lastMessagesSnapshot = await orderedUserMessagesRef.once(constants.DB_EVENT_NAME_VALUE);
  let prevMessageKey = null;
  lastMessagesSnapshot.forEach((childSnapshot) => {
    if (
      childSnapshot.key === constants.IS_AWAITING_FLAG_IMAGE ||
      childSnapshot.key === constants.IS_AWAITING_FLAG_TEXT
    ) {
      return;
    }
    prevMessageKey = childSnapshot.key;
  });
  // Throw error if could not find previous message
  if (!prevMessageKey) {
    console.error('Could not retrieve previous message to attach current message to');
  }

  // Attach current message to previous message
  const prevMessageRef = messagesRef.child(prevMessageKey);
  if (
    receivedMessage.attachments &&
    receivedMessage.attachments['0'].type === 'image' &&
    isAwaitingImage
  ) {
    // Attach image to previous message
    prevMessageRef.update({
      attachments: receivedMessage.attachments,
    });
    responseCode = constants.RESPONSE_CODE_ATTACHED_IMAGE;
    showInTimeline = false;
  } else if (receivedMessage.text && isAwaitingText) {
    // Attach text to previous message
    prevMessageRef.update({
      text: receivedMessage.text,
    });
    responseCode = constants.RESPONSE_CODE_ATTACHED_TEXT;
    showInTimeline = false;
  }

  // Remove isAwaitingImage and isAwaitingText flags
  isAwaitingImageRef.remove();
  isAwaitingTextRef.remove();

  // Let Lumi know that the response should reference the previous message.
  // This is relevant for message categorisation.
  messageRef = prevMessageRef;

  return {
    responseCode,
    showInTimeline,
    messageRef,
  };
};


/**
 * Update DB to reference new message by the given user's active group, if any.
 * Specifically, 1) update message to reference gid, and 2) update relevant path in
 * lumi-group-messages to reference this message key
 */
const handleMessageToGroup = async (psid, newMessageRef) => {
  console.log('Running function handleMessageToGroup');
  const db = admin.database();
  const psidToUidRef = db.ref(`${constants.DB_PATH_USER_PSID_TO_UID}/${psid}`);
  const psidToUidSnapshot = await psidToUidRef.once(constants.DB_EVENT_NAME_VALUE);
  const uid = psidToUidSnapshot.val();
  // Return if there is no entry for the given PSID in the user-psid-to-uid path
  // This means the user has not signed into lumicares.com yet.
  if (!uid) {
    return null;
  }
  const userRef = db.ref(`${constants.DB_PATH_USERS}/${uid}`);
  const userSnapshot = await userRef.once(constants.DB_EVENT_NAME_VALUE);
  const user = userSnapshot.val();
  const userGroups = user.groups;
  const userGroupsArray = Object.keys(userGroups);
  const numUserGroups = userGroupsArray.length;
  // Return if user has no groups. This means a user may have
  // signed in to lumicares.com but not yet joined or created a group.
  if (!userGroups || numUserGroups <= 0) {
    return null;
  }
  // If user has one group, then save message to active group
  if (numUserGroups === 1) {
    const groupId = user.activeGroup;
    saveMessageToGroup(newMessageRef, groupId);
    console.log('Saved Lumi message to DB!');
    return null;
  }
  // If user has more than one group, return an array of the user's groups so getResponse
  // knows to prompt user to choose a group to save the message to
  return userGroupsArray;
};


/**
 * Handle all non-quick-reply messages with text and attachments
 */
const handleTextAndAttachments = async (webhookEvent, messagesRef, userMessagesRef) => {
  console.log('Running function handleTextAndAttachments');
  let responseCode = constants.RESPONSE_CODE_NEW_MESSAGE;
  let showInTimeline = true;
  let messageRef = null;

  // Handle attachments to previous messages
  const isAwaitingImageRef = userMessagesRef.child(constants.IS_AWAITING_FLAG_IMAGE);
  const isAwaitingImageSnapshot = await isAwaitingImageRef.once(constants.DB_EVENT_NAME_VALUE);
  const isAwaitingImage = isAwaitingImageSnapshot.val();
  const isAwaitingTextRef = userMessagesRef.child(constants.IS_AWAITING_FLAG_TEXT);
  const isAwaitingTextSnapshot = await isAwaitingTextRef.once(constants.DB_EVENT_NAME_VALUE);
  const isAwaitingText = isAwaitingTextSnapshot.val();
  const receivedMessage = webhookEvent.message;
  if (isAwaitingImage || isAwaitingText) {
    const responseInfo = await attachToPrevMessage(
      messagesRef, userMessagesRef, receivedMessage, isAwaitingImage, isAwaitingText,
      isAwaitingImageRef, isAwaitingTextRef, responseCode, showInTimeline, messageRef,
    );
    responseCode = responseInfo.responseCode;
    showInTimeline = responseInfo.showInTimeline;
    messageRef = responseInfo.messageRef;
  }

  // Save message to DB. Message content is stored in the lumi-messages path,
  // and the lumi-messages-user and lumi-messages-group determine which messages belong
  // to which users and groups respectively.
  const senderPsid = webhookEvent.sender.id;
  const newMessageRef = messagesRef.push({
    ...receivedMessage,
    senderPsid,
    // Show in timeline if current message is not an attachment of previous message
    showInTimeline,
    category: constants.MESSAGE_CATEGORY_CODE_OTHER,
    timestamp: webhookEvent.timestamp,
  });
  // Save new message key in the lumi-messages-user path so that Lumi can easily lookup
  // messages from each user
  userMessagesRef.update({
    [newMessageRef.key]: true,
  });
  // If user does not belong to any groups (i.e. hasn't signed into lumicares.com yet),
  // do not save her messages under any GID. These messages will be saved to the relevant
  // GID after she logs into lumicares.com and either joins or creates a group.
  // If user belongs to a single group, save the message to that group.
  // If user belongs to multiple groups, userGroups is array of group IDs for user to choose from.
  const userGroups = await handleMessageToGroup(senderPsid, newMessageRef);
  // If response is not already referencing previous message because the new message
  // was attached to the previous message, have the response reference the new message.
  if (!messageRef) {
    messageRef = newMessageRef;
  }
  return getResponse(webhookEvent, responseCode, messageRef, userGroups);
};


/**
 * Handle message events from Messenger Platform
 */
const handleMessage = async (webhookEvent) => {
  console.log('Running function handleMessage');
  let response = null;
  const receivedMessage = webhookEvent.message;
  const db = admin.database();
  const messagesRef = db.ref(constants.DB_PATH_LUMI_MESSAGES);
  const senderPsid = webhookEvent.sender.id;
  const userMessagesRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES_USER}/${senderPsid}`);

  // Handle quick replies separately from regular text because they are responses to prev message
  // Handle quick replies first because quick reply messages can also contain text
  const quickReply = receivedMessage.quick_reply;
  if (quickReply) {
    response = await handleQuickReply(webhookEvent, messagesRef, userMessagesRef);
  // Handle free-form text and image messages
  } else if (receivedMessage.text || receivedMessage.attachments) {
    // If message contains image, store image in Firebase Storage and attach this URL to message
    if (receivedMessage.attachments) {
      const originalImageUrl = receivedMessage.attachments['0'].payload.url;
      receivedMessage.attachments['0'].payload.url = await saveImageToDb(originalImageUrl);
    }
    response = await handleTextAndAttachments(webhookEvent, messagesRef, userMessagesRef);
  }

  // Send the response message
  await callSendApi(senderPsid, response);

  // If received message is end of sequence, send welcome message
  if (quickReply) {
    const quickReplyPayload = JSON.parse(quickReply.payload);
    const responseCode = quickReplyPayload.code;
    if (
      responseCode.includes('category') ||
      [
        constants.RESPONSE_CODE_CREATE_CARE_GROUP_YES,
        constants.RESPONSE_CODE_CREATE_CARE_GROUP_NO,
        constants.RESPONSE_CODE_SHARE_MOMENT_NO,
      ].indexOf(responseCode) >= 0
    ) {
      const firstName = await utils.getUserFirstName(senderPsid);
      await sendWelcomeMessage(senderPsid, firstName);
    }
  }
};


/**
 * Handle postback events from Messenger Platform
 * TODO(kai): Write tests
 */
const handlePostback = async (webhookEvent) => {
  const senderPsid = webhookEvent.sender.id;
  const firstName = await utils.getUserFirstName(senderPsid);

  // TODO(kai): Integrate this with getResponse
  // Generate response
  let response = { text: 'bad response', quick_replies: null };
  if (webhookEvent.postback.payload === constants.POSTBACK_CODE_GET_STARTED) {
    response = {
      text: `Hey ${firstName}! ${constants.RESPONSE_MESSAGE_GET_STARTED}`,
      quick_replies: [
        {
          title: 'Create Care Circle',
          content_type: constants.QUICK_REPLY_CONTENT_TYPE_TEXT,
          // Save quickReply payload as JSON string because payload only supports string values
          payload: JSON.stringify({
            code: constants.RESPONSE_CODE_CREATE_CARE_GROUP_YES,
          }),
        },
        {
          title: 'Not Now',
          content_type: constants.QUICK_REPLY_CONTENT_TYPE_TEXT,
          // Save quickReply payload as JSON string because payload only supports string values
          payload: JSON.stringify({
            code: constants.RESPONSE_CODE_CREATE_CARE_GROUP_NO,
          }),
        }
      ],
    };
  }

  // Send the response message
  await callSendApi(senderPsid, response);
};


/**
 * Triage events from Messenger Platform
 */
export const message = async (req, res) => {
  console.log('Running function message');
  // Return 404 if event not from page subscription
  if (req.body.object !== 'page') {
    res.sendStatus(404);
    return;
  }
  // Iterate over each entry - there may be multiple if batched
  await Promise.all(req.body.entry.map(async (entry) => {
    // Get the message. entry.messaging is an array, but
    // will only ever contain one message, so we get index 0.
    const webhookEvent = entry.messaging[0];
    // Log event for debugging
    console.log(webhookEvent);
    // Currently Lumi only handles message events
    if (webhookEvent.message) {
      await handleMessage(webhookEvent);
    } else if (webhookEvent.postback) {
      await handlePostback(webhookEvent);
    }
  }));
  // Return 200 to all requests to Lumi the Page to signal message received
  res.status(200).send('EVENT_RECEIVED');
};
