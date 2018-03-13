import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as rp from 'request-promise';

import * as constants from '../static/constants';
import * as utils from '../utils';


/**
 * Boilerplate function for Messenger Platform to verify webhook authenticity
 */
export const verify = (req, res) => {
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
  // Get PSIDs from FB Graph API
  const psidRequestOptions = {
    uri: `${constants.URL_FB_GRAPH_API}/${req.query.asid}`,
    qs: {
      fields: 'ids_for_pages',
      access_token: functions.config().lumi.token_app_access,
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
 * Send response message via the Send API
 */
const callSendApi = async (senderPsid, response) => {
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
    qs: { access_token: functions.config().lumi.token_page_access },
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
 * Generate quick reply object for specific response
 */
const getQuickReply = (messageRef, responseCode) => ({
  title: utils.responseCodeToQuickReplyTitle(responseCode),
  content_type: constants.QUICK_REPLY_CONTENT_TYPE_TEXT,
  // Save quickReply payload as JSON string because payload only supports string values
  payload: JSON.stringify({
    code: responseCode,
    messageKey: messageRef.key,
  }),
});

/**
 * Get response for a specific message type from Lumi Chat
 */
const getResponse = (receivedMessage, receivedResponseCode, messageRef) => {
  let quickReplies = null;
  if (receivedResponseCode === constants.RESPONSE_CODE_NEW_MESSAGE) {
    // If the received message contains text, provide option to attach image
    if ('text' in receivedMessage) {
      quickReplies = [
        getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_IMAGE_YES),
        getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_IMAGE_NO),
      ];
    // If the received message contains image, provide option to attach text
    } else {
      quickReplies = [
        getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_TEXT_YES),
        getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_TEXT_NO),
      ];
    }
  // Ask user to choose category once no further attachments
  } else if (
    receivedResponseCode === constants.RESPONSE_CODE_ATTACH_IMAGE_NO ||
    receivedResponseCode === constants.RESPONSE_CODE_ATTACH_TEXT_NO ||
    receivedResponseCode.indexOf('attached') >= 0
  ) {
    quickReplies = [
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_ACTIVITY),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MOOD),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MEMORY),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MEDICAL),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_CAREGIVER),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_OTHER),
    ];
  }
  return {
    text: utils.responseCodeToResponseMessage(receivedResponseCode, receivedMessage),
    quick_replies: quickReplies,
  };
};

/**
 * Update DB to reference new message by the given user's active group, if any.
 * Specifically, 1) update message to reference gid, and 2) update relevant path in
 * lumi-group-messages to reference this message key
 */
const saveMessageToGroup = async (psid, newMessageRef) => {
  const db = admin.database();
  const psidToUidRef = db.ref(`${constants.DB_PATH_USER_PSID_TO_UID}/${psid}`);
  const psidToUidSnapshot = await psidToUidRef.once(constants.DB_EVENT_NAME_VALUE);
  const uid = psidToUidSnapshot.val();
  // Return if there is no entry for the given PSID in the user-psid-to-uid path
  // This means the user has not signed into lumicares.com yet.
  if (!uid) {
    return;
  }
  const userRef = db.ref(`${constants.DB_PATH_USERS}/${uid}`);
  const userSnapshot = await userRef.once(constants.DB_EVENT_NAME_VALUE);
  // TODO(kai): Allow user to select which group she wishes to save message to, instead
  // of defaulting to active group
  const gid = userSnapshot.val().activeGroup;
  // Return if there is no activeGroup assigned to a user. This means a user may have
  // signed in to lumicares.com but not yet joined or created a group.
  if (!gid) {
    return;
  }
  // Store GID in new message
  newMessageRef.update({
    group: gid,
  });
  // Store new message key in lumi-messages-group path under the active GID
  const groupMessagesRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${gid}`);
  groupMessagesRef.update({
    [newMessageRef.key]: true,
  });
};

/**
 * Handle message events from Messenger Platform
 */
const handleMessage = async (webhookEvent) => {
  let response;
  const receivedMessage = webhookEvent.message;
  const db = admin.database();
  const messagesRef = db.ref(constants.DB_PATH_LUMI_MESSAGES);
  const senderPsid = webhookEvent.sender.id;
  const userMessagesRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES_USER}/${senderPsid}`);

  // Handle quick replies separately from regular text because they are responses to prev message
  // Handle quick replies first because quick reply messages can also contain text
  const quickReply = receivedMessage.quick_reply;
  if (quickReply) {
    // Save quickReply payload as JSON string because payload only supports string values
    const quickReplyPayload = JSON.parse(quickReply.payload);
    const responseCode = quickReplyPayload.code;
    const messageRef = messagesRef.child(quickReplyPayload.messageKey);
    // If user chooses to add attachment to prev message, set a flag to indicate this
    if (responseCode === constants.RESPONSE_CODE_ATTACH_IMAGE_YES) {
      userMessagesRef.update({ isAwaitingImage: true });
    } else if (responseCode === constants.RESPONSE_CODE_ATTACH_TEXT_YES) {
      userMessagesRef.update({ isAwaitingText: true });
    // If quick reply is about setting a message category, update message category
    } else if (responseCode.indexOf('category') >= 0) {
      messageRef.update({ category: utils.responseCodeToMessageCategoryCode(responseCode) });
    }
    // Generate response based on received response code
    response = getResponse(receivedMessage, responseCode, messageRef);

  // Handle free-form text and image messages
  } else if (receivedMessage.text || receivedMessage.attachments) {
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
    if (isAwaitingImage || isAwaitingText) {
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
    }

    // Save message to DB. Message content is stored in the lumi-messages path,
    // and the lumi-messages-user and lumi-messages-group determine which messages belong
    // to which users and groups respectively.
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
    await saveMessageToGroup(senderPsid, newMessageRef);
    console.log('Saved Lumi message to DB!');
    // If response is not already referencing previous message, have it reference the new message.
    if (!messageRef) {
      messageRef = newMessageRef;
    }
    response = getResponse(receivedMessage, responseCode, messageRef);
  }

  // Send the response message
  await callSendApi(senderPsid, response);
};

/**
 * Triage events from Messenger Platform
 */
export const message = (req, res) => {
  // Return 404 if event not from page subscription
  if (req.body.object !== 'page') {
    res.sendStatus(404);
    return;
  }
  // Iterate over each entry - there may be multiple if batched
  req.body.entry.forEach(async (entry) => {
    // Get the message. entry.messaging is an array, but
    // will only ever contain one message, so we get index 0.
    const webhookEvent = entry.messaging[0];
    // Log event for debugging
    console.log(webhookEvent);
    // Currently Lumi only handles message events
    if (webhookEvent.message) {
      await handleMessage(webhookEvent);
    }
  });
  // Return 200 to all requests to Lumi the Page to signal message received
  res.status(200).send('EVENT_RECEIVED');
};
