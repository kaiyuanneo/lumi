import * as functions from 'firebase-functions';


export const MESSAGE_WEBHOOK_STARTUP = 'Webhook is listening';

export const PORT = 1337;

export const ROUTE_MESSAGE = '/';
export const ROUTE_VERIFY = '/';

export const TOKEN_PAGE_ACCESS = functions.config().webhook.page_access_token;
export const TOKEN_VERIFY = 'zCVBkBRxi8Ttaqqeaio';

export const URL_SEND_API = 'https://graph.facebook.com/v2.6/me/messages';
