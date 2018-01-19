import * as request from 'request';

import * as constants from '../static/constants';


// Sends response messages via the Send API
const callSendAPI = (senderPsid, response) => {
  // Construct the message body
  const requestBody = {
    recipient: {
      id: senderPsid
    },
    message: response
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: constants.URL_SEND_API,
      qs: { access_token: constants.TOKEN_PAGE_ACCESS },
      method: 'POST',
      json: requestBody
    },
    (err, res, body) => {
      if (!err) {
        console.log('Message sent!');
      } else {
        console.error(`Unable to send message: ${err}`);
      }
    }
  );
};

// Handles messages events
const handleMessage = (senderPsid, receivedMessage) => {
  let response;
  // Check if the message contains text
  if (receivedMessage.text) {
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
  callSendAPI(senderPsid, response);
};

// Handles messaging_postbacks events
const handlePostback = (senderPsid, receivedPostback) => {
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
  callSendAPI(senderPsid, response);
};

export const message = (req, res) => {
  // Check this is an event from a page subscription
  if (req.body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    req.body.entry.forEach((entry) => {
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
        handleMessage(senderPsid, webhookEvent.message);
      } else if (webhookEvent.postback) {
        handlePostback(senderPsid, webhookEvent.postback);
      }
    });
    // Return a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};
