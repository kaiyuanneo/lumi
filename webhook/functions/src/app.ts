import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import * as constants from './static/constants';
import routes from './routes';


// Initialise Firebase Admin API
admin.initializeApp({
  ...functions.config().firebase,
  credential: admin.credential.cert({
    projectId: 'lumi-cares',
    clientEmail: 'lumi-cares@appspot.gserviceaccount.com',
    // Private key is stored with newlines escaped in functions config
    privateKey: functions.config().lumi.service_account_private_key.replace(/\\n/g, '\n'),
  }),
});

// Create Express HTTP server
const app = express();
app.use(bodyParser.json());

// Set server port and log message on success
const port = process.env.PORT !== undefined ? process.env.PORT : constants.PORT;
const server = app.listen(port, () => console.log(constants.MESSAGE_WEBHOOK_STARTUP));

// Set up routing
app.use(routes);

// Deploy method in package.json controls whether we deploy staging or prod webhook
export const webhook = functions.https.onRequest(app);
export const webhookStaging = functions.https.onRequest(app);

// Private function to stop server after tests finish running accessible via Rewire module
// Disable TSLint's unused variable rule so it does not complain about this "unused" private var
// tslint:disable:no-unused-variable
const stop = () => {
  server.close();
};
