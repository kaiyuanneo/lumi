import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import * as constants from './static/constants';
import routes from './routes';


// Initialise DB
admin.initializeApp(functions.config().firebase);

// Create Express HTTP server
const app = express();
app.use(bodyParser.json());

// Set server port and log message on success
const port = process.env.PORT !== undefined ? process.env.PORT : constants.PORT;
app.listen(port, () => console.log(constants.MESSAGE_WEBHOOK_STARTUP));

// Set up routing
app.use(routes);

// Use outdated exports syntax to give the URL endpoint a name
// If we use "export default" the webhook URL ends with "default"
exports.webhook = functions.https.onRequest(app);
