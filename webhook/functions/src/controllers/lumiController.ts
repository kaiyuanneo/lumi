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

// This function needs to happen in server-side code because we cannot expose
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
  // Set Access-Control-Allow-Origin header so Cloud Functions can respond to
  // lumicares.com.
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
    uri: constants.URL_SEND_API,
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

// Handles messages events
const handleMessage = async (senderPsid, webhookEvent) => {
  let response;
  const receivedMessage = webhookEvent.message;
  // Check if the message contains text
  if (receivedMessage.text) {
    // Save message to DB
    const db = admin.database();
    db.ref(`${constants.DB_PATH_LUMI_MESSAGES}/${senderPsid}`).push({ ...receivedMessage });
    console.log('Saved Lumi message to DB!');

    // Create the payload for a basic text message
    response = {
      text: `You sent the message: "${receivedMessage.text}". Now send me an image!`
    };
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

// Handles messaging_postbacks events
const handlePostback = async (senderPsid, receivedPostback) => {
  let response;

  // Get the payload for the postback
  const payload = receivedPostback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { text: 'Thanks!' };
  } else if (payload === 'no') {
    response = { text: 'Oops, try sending another image.' };
  }
  // Send the message to acknowledge the postback
  await callSendApi(senderPsid, response);
};

export const message = (req, res) => {
  // Check this is an event from a page subscription
  if (req.body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    req.body.entry.forEach(async (entry) => {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      // Get the sender PSID
      const senderPsid = webhookEvent.sender.id;
      console.log('Sender PSID: ' + senderPsid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhookEvent.message) {
        await handleMessage(senderPsid, webhookEvent);
      } else if (webhookEvent.postback) {
        await handlePostback(senderPsid, webhookEvent.postback);
      }
    });
    // Return a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};
