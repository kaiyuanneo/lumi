import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import * as constants from '../static/constants';


export const message = (req, res) => {
  // Handle verification requests by sending back the challenge code
  if (req.body.type === 'url_verification') {
    res.status(200).send(req.body.challenge);
    return;
  }
  if (req.body.type === 'event_callback') {
    // If the secret token does not match, the request may not have come from Slack
    if (req.body.token !== functions.config().pwfn.token) {
      console.error('Slack-webhook token mismatch');
      res.sendStatus(401);
      return;
    }

    // Ignore messages not sent to #pwfn-activity
    if (req.body.event.channel !== constants.SLACK_CHANNEL_ID_PWFN) {
      res.sendStatus(200);
      return;
    }

    // Log error if event type is not message
    if (req.body.event.type !== 'message') {
      console.error('Non-message event sent to PWFN webhook');
      res.sendStatus(404);
      return;
    }

    // Messages from PWFN have a different format from messages typed into the #pwfn-activity
    // channel in Slack. Only save messages that come from PWFN.
    if (req.body.event.attachments) {
      console.log(req.body.event);
      // Record messages sent to #pwfn-activity
      const db = admin.database();
      const pwfnEvent = req.body.event.attachments[0];
      const userId = pwfnEvent.fallback.split('|')[0].split('projectweforgot.mn.co/members/')[1];
      db.ref(`${constants.DB_PATH_PWFN_MESSAGES}/${userId}`).push({
        ...pwfnEvent,
        timestamp: req.body.event_time,
      });
      console.log('Saved PWFN message to DB!');
    }
    res.sendStatus(200);
  }
};
