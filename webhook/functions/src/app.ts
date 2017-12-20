import * as express from 'express';
import * as functions from 'firebase-functions';

import constants from './static/constants';


const PAGE_ACCESS_TOKEN = functions.config().webhook.page_access_token;

// Create express http server
const app = express();

// Set server port and log message on success
const port = process.env.PORT !== null ? process.env.PORT : 1337;
app.listen(port, () => console.log('webhook is listening'));

// Create the endpoint for our webhook
app.post('/', (req, res) => {
  // Check this is an event from a page subscription
  if (req.body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    req.body.entry.forEach((entry) => {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
    });
    // Return a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Add support for GET requests to our webhook
app.get('/', (req, res) => {
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === 'subscribe' && token === constants.VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Use outdated exports syntax to give the URL endpoint a name
// If we use "export default" the webhook URL ends with "default"
exports.webhook = functions.https.onRequest(app);
