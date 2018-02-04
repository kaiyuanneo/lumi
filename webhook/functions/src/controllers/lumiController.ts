import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as rp from 'request-promise';

import * as constants from '../static/constants';


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

const getQuickReply = (messageRef, responseCode) => {
  let title = '';
  switch (responseCode) {
    case constants.RESPONSE_CODE_SHOW_MESSAGE_YES:
      title = constants.QUICK_REPLY_TITLE_YES;
      break;
    case constants.RESPONSE_CODE_SHOW_MESSAGE_NO:
      title = constants.QUICK_REPLY_TITLE_NO;
      break;
    case constants.RESPONSE_CODE_CATEGORY_GENERAL:
      title = constants.QUICK_REPLY_TITLE_CATEGORY_GENERAL;
      break;
    case constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR:
      title = constants.QUICK_REPLY_TITLE_CATEGORY_BEHAVIOUR;
      break;
    case constants.RESPONSE_CODE_CATEGORY_MEMORY:
      title = constants.QUICK_REPLY_TITLE_CATEGORY_MEMORY;
      break;
    case constants.RESPONSE_CODE_CATEGORY_MEDICAL:
      title = constants.QUICK_REPLY_TITLE_CATEGORY_MEDICAL;
      break;
    case constants.RESPONSE_CODE_ATTACH_PHOTO_YES:
      title = constants.QUICK_REPLY_TITLE_YES;
      break;
    case constants.RESPONSE_CODE_ATTACH_PHOTO_NO:
      title = constants.QUICK_REPLY_TITLE_NO;
      break;
    default:
      console.error('Hit default in get quick reply menu');
  }
  return {
    title,
    content_type: constants.QUICK_REPLY_CONTENT_TYPE_TEXT,
    // Save quickReply payload as JSON string because payload only supports string values
    payload: JSON.stringify({
      code: responseCode,
      messageKey: messageRef.key,
    }),
  };
};

const getQuickRepliesAttachPhoto = messageRef => [
  getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_PHOTO_YES),
  getQuickReply(messageRef, constants.RESPONSE_CODE_ATTACH_PHOTO_NO),
];

const getResponse = (receivedMessage, messageRef, responseCode) => {
  let responseMessage = '';
  let quickReplies = null;
  switch (responseCode) {
    case constants.RESPONSE_CODE_NEW_MESSAGE:
      responseMessage = constants.RESPONSE_MESSAGE_NEW_MESSAGE(receivedMessage.text);
      quickReplies = [
        getQuickReply(messageRef, constants.RESPONSE_CODE_SHOW_MESSAGE_YES),
        getQuickReply(messageRef, constants.RESPONSE_CODE_SHOW_MESSAGE_NO),
      ];
      break;
    case constants.RESPONSE_CODE_SHOW_MESSAGE_YES:
      responseMessage = constants.RESPONSE_MESSAGE_SHOW_MESSAGE_YES;
      quickReplies = [
        getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_GENERAL),
        getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR),
        getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MEMORY),
        getQuickReply(messageRef, constants.RESPONSE_CODE_CATEGORY_MEDICAL),
      ];
      break;
    case constants.RESPONSE_CODE_SHOW_MESSAGE_NO:
      responseMessage = constants.RESPONSE_MESSAGE_SHOW_MESSAGE_NO;
      break;
    case constants.RESPONSE_CODE_CATEGORY_GENERAL:
      responseMessage =
        constants.RESPONSE_MESSAGE_CATEGORY(constants.QUICK_REPLY_TITLE_CATEGORY_GENERAL);
      quickReplies = getQuickRepliesAttachPhoto(messageRef);
      break;
    case constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR:
      responseMessage =
        constants.RESPONSE_MESSAGE_CATEGORY(constants.QUICK_REPLY_TITLE_CATEGORY_BEHAVIOUR);
      quickReplies = getQuickRepliesAttachPhoto(messageRef);
      break;
    case constants.RESPONSE_CODE_CATEGORY_MEMORY:
      responseMessage =
        constants.RESPONSE_MESSAGE_CATEGORY(constants.QUICK_REPLY_TITLE_CATEGORY_MEMORY);
      quickReplies = getQuickRepliesAttachPhoto(messageRef);
      break;
    case constants.RESPONSE_CODE_CATEGORY_MEDICAL:
      responseMessage =
        constants.RESPONSE_MESSAGE_CATEGORY(constants.QUICK_REPLY_TITLE_CATEGORY_MEDICAL);
      quickReplies = getQuickRepliesAttachPhoto(messageRef);
      break;
    // TODO(kai): Activate camara when user selects yes to attach photo
    case constants.RESPONSE_CODE_ATTACH_PHOTO_YES:
    case constants.RESPONSE_CODE_ATTACH_PHOTO_NO:
      responseMessage = constants.RESPONSE_MESSAGE_SAVE_MESSAGE;
      break;
    default:
      console.error('Hit default in get response menu');
  }
  return {
    text: responseMessage,
    quick_replies: quickReplies,
  };
};

// Handle message events
const handleMessage = async (webhookEvent) => {
  let response;
  const receivedMessage = webhookEvent.message;
  const senderPsid = webhookEvent.sender.id;
  const messagesRef = admin.database().ref(`${constants.DB_PATH_LUMI_MESSAGES}/${senderPsid}`);

  // Handle quick replies separately from regular text
  const quickReply = receivedMessage.quick_reply;
  if (quickReply) {
    // Save quickReply payload as JSON string because payload only supports string values
    const quickReplyPayload = JSON.parse(quickReply.payload);
    const messageRef = messagesRef.child(quickReplyPayload.messageKey);
    switch (quickReplyPayload.code) {
      case constants.RESPONSE_CODE_SHOW_MESSAGE_YES:
        messageRef.update({ show_in_timeline: true });
        response =
          getResponse(receivedMessage, messageRef, constants.RESPONSE_CODE_SHOW_MESSAGE_YES);
        break;
      case constants.RESPONSE_CODE_SHOW_MESSAGE_NO:
        messageRef.update({ show_in_timeline: false });
        response =
          getResponse(receivedMessage, messageRef, constants.RESPONSE_CODE_SHOW_MESSAGE_NO);
        break;
      case constants.RESPONSE_CODE_CATEGORY_GENERAL:
        messageRef.update({ category: constants.MESSAGE_CATEGORY_CODE_GENERAL });
        response =
          getResponse(receivedMessage, messageRef, constants.RESPONSE_CODE_CATEGORY_GENERAL);
        break;
      case constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR:
        messageRef.update({ category: constants.MESSAGE_CATEGORY_CODE_BEHAVIOUR });
        response =
          getResponse(receivedMessage, messageRef, constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR);
        break;
      case constants.RESPONSE_CODE_CATEGORY_MEMORY:
        messageRef.update({ category: constants.MESSAGE_CATEGORY_CODE_MEMORY });
        response =
          getResponse(receivedMessage, messageRef, constants.RESPONSE_CODE_CATEGORY_MEMORY);
        break;
      case constants.RESPONSE_CODE_CATEGORY_MEDICAL:
        messageRef.update({ category: constants.MESSAGE_CATEGORY_CODE_MEDICAL });
        response =
          getResponse(receivedMessage, messageRef, constants.RESPONSE_CODE_CATEGORY_MEDICAL);
        break;
      case constants.RESPONSE_CODE_ATTACH_PHOTO_YES:
        // TODO(kai): Activate camara and/or photo stream when user selects yes to attach photo
        response =
          getResponse(receivedMessage, messageRef, constants.RESPONSE_CODE_ATTACH_PHOTO_YES);
        break;
      case constants.RESPONSE_CODE_ATTACH_PHOTO_NO:
        response =
          getResponse(receivedMessage, messageRef, constants.RESPONSE_CODE_ATTACH_PHOTO_NO);
        break;
      default:
        console.error('Hit default in handle message menu');
    }
  } else if (receivedMessage.text) {
    // Save message to DB
    const newMessageRef = messagesRef.push({
      ...receivedMessage,
      category: constants.MESSAGE_CATEGORY_CODE_GENERAL,
      show_in_timeline: false,
    });
    console.log('Saved Lumi message to DB!');
    response = getResponse(receivedMessage, newMessageRef, constants.RESPONSE_CODE_NEW_MESSAGE);
  // TODO(kai): Remove this nonsense
  } else if (receivedMessage.attachments) {
    // Gets the URL of the message attachment
    const attachmentUrl = receivedMessage.attachments[0].payload.url;
    response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: 'Is this the right picture?',
            subtitle: 'Tap a button to answer.',
            image_url: attachmentUrl,
            buttons: [
              {
                type: 'postback',
                title: 'Yes!',
                payload: 'yes',
              },
              {
                type: 'postback',
                title: 'No!',
                payload: 'no',
              }
            ],
          }]
        }
      }
    };
  }
  // Send the response message
  await callSendApi(senderPsid, response);
};

// Handle messaging_postback events
const handlePostback = async (webhookEvent) => {
  // Set the response based on the postback payload
  let response;
  const payload = webhookEvent.postback.payload;
  if (payload === 'yes') {
    response = { text: 'Thanks!' };
  } else if (payload === 'no') {
    response = { text: 'Oops, try sending another image.' };
  }
  // Send the message to acknowledge the postback
  await callSendApi(webhookEvent.sender.id, response);
};

export const message = (req, res) => {
  // Check this is an event from a page subscription
  if (req.body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    req.body.entry.forEach(async (entry) => {
      // Get the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0.
      const webhookEvent = entry.messaging[0];
      // Log event for debugging
      console.log(webhookEvent);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhookEvent.message) {
        await handleMessage(webhookEvent);
      } else if (webhookEvent.postback) {
        await handlePostback(webhookEvent);
      }
    });
    // Return 200 to all requests to Lumi the Page
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return 404 if event not from page subscription
    res.sendStatus(404);
  }
};
