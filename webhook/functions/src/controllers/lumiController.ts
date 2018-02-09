import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as rp from 'request-promise';

import * as constants from '../static/constants';
import * as utils from '../utils';


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

// This function needs to happen server-side because we cannot expose
// Lumi's app access token in the client
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
  let psid = null;
  psidParsedBody.ids_for_pages.data.forEach((pageInfo) => {
    if (pageInfo.page.id === constants.PAGE_ID_LUMI) {
      psid = pageInfo.id;
    }
  });

  // Send PSID back to client
  // Set Access-Control-Allow-Origin header so Cloud Functions can respond to lumicares.com
  res.status(200).set('Access-Control-Allow-Origin', '*').json({ psid });
};

// Sends response messages via the Send API
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

const getQuickReply = (messageRef, responseCode) => ({
  title: utils.responseCodeToQuickReplyTitle(responseCode),
  content_type: constants.QUICK_REPLY_CONTENT_TYPE_TEXT,
  // Save quickReply payload as JSON string because payload only supports string values
  payload: JSON.stringify({
    code: responseCode,
    messageKey: messageRef.key,
  }),
});

const getResponse = (receivedMessage, responseCode, messageRef) => {
  let quickReplies = null;
  if (responseCode === constants.RESPONSE_CODE_NEW_MESSAGE) {
    quickReplies = [
      getQuickReply(messageRef, constants.RESPONSE_CODE_SHOW_MESSAGE_YES),
      getQuickReply(messageRef, constants.RESPONSE_CODE_SHOW_MESSAGE_NO),
    ];
  } else if (responseCode === constants.RESPONSE_CODE_SHOW_MESSAGE_YES) {
    quickReplies = [
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_ACTIVITY),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MOOD),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MEMORY),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MEDICAL),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_CAREGIVER),
      getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_OTHER),
    ];
  } else if (responseCode.indexOf('category') >= 0) {
    quickReplies = [
      getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_PHOTO_YES),
      getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_PHOTO_NO),
    ];
  }
  return {
    text: utils.responseCodeToResponseMessage(responseCode, receivedMessage),
    quick_replies: quickReplies,
  };
};

// Handle message events
const handleMessage = async (webhookEvent) => {
  let response;
  const receivedMessage = webhookEvent.message;
  const senderPsid = webhookEvent.sender.id;
  const messagesRef = admin.database().ref(`${constants.DB_PATH_LUMI_MESSAGES}/${senderPsid}`);

  // Handle quick replies separately from regular text because they are responses to prev message
  // Handle quick replies first because quick reply messages can also contain text
  const quickReply = receivedMessage.quick_reply;
  if (quickReply) {
    // Save quickReply payload as JSON string because payload only supports string values
    const quickReplyPayload = JSON.parse(quickReply.payload);
    const responseCode = quickReplyPayload.code;
    const messageRef = messagesRef.child(quickReplyPayload.messageKey);

    // If quick reply is about showing the message, update message visibility
    if (responseCode.indexOf('show-message') >= 0) {
      if (responseCode === constants.RESPONSE_CODE_SHOW_MESSAGE_YES) {
        messageRef.update({ show_in_timeline: true });
      }
    // Else if quick reply is about setting a message category, update message category
    } else if (responseCode.indexOf('category') >= 0) {
      messageRef.update({ category: utils.responseCodeToMessageCategoryCode(responseCode) });
    // Else if quick reply is not about attaching a photo, throw an error
    // TODO(kai): Implement attach photo functionality
    } else if (responseCode.indexOf('attach-photo') < 0) {
      console.error('Hit default in handle message menu');
    }
    // Generate response based on received response code
    response = getResponse(receivedMessage, responseCode, messageRef);
  } else if (receivedMessage.text) {
    // Save message to DB immediately
    const newMessageRef = messagesRef.push({
      ...receivedMessage,
      category: constants.MESSAGE_CATEGORY_CODE_OTHER,
      show_in_timeline: false,
    });
    console.log('Saved Lumi message to DB!');
    response = getResponse(receivedMessage, constants.RESPONSE_CODE_NEW_MESSAGE, newMessageRef);
  }

  // Send the response message
  await callSendApi(senderPsid, response);
};

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
