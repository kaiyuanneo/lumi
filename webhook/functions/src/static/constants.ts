// Date that signed URL links from Google Cloud Storage expire. Ideally they would never expire
// but GCS requires us to provide an expiry date.
export const DATE_IMAGE_EXPIRY = '3000-01-01';

export const DB_EVENT_NAME_VALUE = 'value';

export const DB_PATH_LUMI_GROUPS = 'lumi-groups';
export const DB_PATH_LUMI_MESSAGES = 'lumi-messages';
export const DB_PATH_LUMI_MESSAGES_USER = 'lumi-messages-user';
export const DB_PATH_LUMI_MESSAGES_GROUP = 'lumi-messages-group';
export const DB_PATH_PWFN_MESSAGES = 'pwfn-messages';
export const DB_PATH_USER_PSID_TO_UID = 'user-psid-to-uid';
export const DB_PATH_USERS = 'users';

export const DEFAULT_ERROR_MESSAGE =
  'Oops! Something went wrong. We will fix this as soon as possible!';

export const ENV_PROD = 'PROD';
export const ENV_STAGING = 'STAGING';
export const ENV_TEST = 'TEST';

// Google Analytics categories
export const GA_CATEGORY_MESSAGE = 'MESSAGE';
export const GA_CATEGORY_POSTBACK = 'POSTBACK';
export const GA_CATEGORY_QUICK_REPLY = 'QUICK_REPLY';
export const GA_CATEGORY_TEXT_OR_IMAGE = 'TEXT_AND_IMAGES';
// General actions
export const GA_ACTION_RECEIVED_MESSAGE = 'RECEIVED_MESSAGE';
// Free form message actions
export const GA_ACTION_TEXT = 'TEXT';
export const GA_ACTION_IMAGE = 'IMAGE';
// Postback actions
export const GA_ACTION_GET_STARTED = 'GET_STARTED';
export const GA_ACTION_ADD_MOMENT = 'ADD_MOMENT';
export const GA_ACTION_VIEW_MOMENTS = 'VIEW_MOMENTS';
// Quick reply actions
export const GA_ACTION_CREATE_CARE_GROUP_YES = 'CREATE_CARE_GROUP_YES';
export const GA_ACTION_CREATE_CARE_GROUP_NO = 'CREATE_CARE_GROUP_NO';
export const GA_ACTION_SHARE_MOMENT_YES = 'SHARE_MOMENT_YES';
export const GA_ACTION_SHARE_MOMENT_NO = 'SHARE_MOMENT_NO';
export const GA_ACTION_ATTACH_IMAGE_YES = 'ATTACH_IMAGE_YES';
export const GA_ACTION_ATTACH_IMAGE_NO = 'ATTACH_IMAGE_NO';
export const GA_ACTION_ATTACH_TEXT_YES = 'ATTACH_TEXT_YES';
export const GA_ACTION_ATTACH_TEXT_NO = 'ATTACH_TEXT_NO';
export const GA_ACTION_STAR_YES = 'STAR_YES';
export const GA_ACTION_STAR_NO = 'STAR_NO';
export const GA_ACTION_CHOSE_GROUP = 'CHOSE_GROUP';
export const GA_ACTION_CHOSE_CATEGORY_ACTIVITY = 'CHOSE_CATEGORY_ACTIVITY';
export const GA_ACTION_CHOSE_CATEGORY_BEHAVIOUR = 'CHOSE_CATEGORY_BEHAVIOUR';
export const GA_ACTION_CHOSE_CATEGORY_MOOD = 'CHOSE_CATEGORY_MOOD';
export const GA_ACTION_CHOSE_CATEGORY_MEMORY = 'CHOSE_CATEGORY_MEMORY';
export const GA_ACTION_CHOSE_CATEGORY_MEDICAL = 'CHOSE_CATEGORY_MEDICAL';
export const GA_ACTION_CHOSE_CATEGORY_CAREGIVER = 'CHOSE_CATEGORY_CAREGIVER';
export const GA_ACTION_CHOSE_CATEGORY_OTHER = 'CHOSE_CATEGORY_OTHER';

export const IS_AWAITING_FLAG_IMAGE = 'isAwaitingImage';
export const IS_AWAITING_FLAG_TEXT = 'isAwaitingText';

export const MESSAGE_CATEGORY_CODE_ACTIVITY = 'activity';
export const MESSAGE_CATEGORY_CODE_BEHAVIOUR = 'behaviour';
export const MESSAGE_CATEGORY_CODE_MOOD = 'mood';
export const MESSAGE_CATEGORY_CODE_MEMORY = 'memory';
export const MESSAGE_CATEGORY_CODE_MEDICAL = 'medical';
export const MESSAGE_CATEGORY_CODE_CAREGIVER = 'caregiver';
export const MESSAGE_CATEGORY_CODE_OTHER = 'other';

export const MESSAGE_WEBHOOK_STARTUP = 'Webhook is listening';

export const PAGE_ID_LUMI = '159838238099782';

export const PORT = 1337;

export const POSTBACK_CODE_GET_STARTED = 'GET_STARTED';
export const POSTBACK_CODE_ADD_MOMENT = 'ADD_MOMENT';
export const POSTBACK_CODE_VIEW_MOMENTS = 'VIEW_MOMENTS';

export const QUICK_REPLY_CONTENT_TYPE_TEXT = 'text';

export const QUICK_REPLY_TITLE_YES = 'Yes';
export const QUICK_REPLY_TITLE_NO = 'No';
export const QUICK_REPLY_TITLE_CATEGORY_ACTIVITY = 'Activity';
export const QUICK_REPLY_TITLE_CATEGORY_BEHAVIOUR = 'Behaviour';
export const QUICK_REPLY_TITLE_CATEGORY_MOOD = 'Mood';
export const QUICK_REPLY_TITLE_CATEGORY_MEMORY = 'Memory';
export const QUICK_REPLY_TITLE_CATEGORY_MEDICAL = 'Medical';
export const QUICK_REPLY_TITLE_CATEGORY_CAREGIVER = 'Caregiver';
export const QUICK_REPLY_TITLE_CATEGORY_OTHER = 'Other';

// Get started response codes
export const RESPONSE_CODE_GET_STARTED = 'get-started';
export const RESPONSE_CODE_CREATE_CARE_GROUP_YES = 'create-care-group-yes';
export const RESPONSE_CODE_CREATE_CARE_GROUP_NO = 'create-care-group-no';

// Welcome message response codes
export const RESPONSE_CODE_SHARE_MOMENT_YES = 'share-moment-yes';
export const RESPONSE_CODE_SHARE_MOMENT_NO = 'share-moment-no';

// Free message response codes
export const RESPONSE_CODE_NEW_MESSAGE = 'new-message';
export const RESPONSE_CODE_ATTACH_IMAGE_YES = 'attach-image-yes';
export const RESPONSE_CODE_ATTACH_IMAGE_NO = 'attach-image-no';
export const RESPONSE_CODE_ATTACH_TEXT_YES = 'attach-text-yes';
export const RESPONSE_CODE_ATTACH_TEXT_NO = 'attach-text-no';
export const RESPONSE_CODE_ATTACHED_IMAGE = 'attached-image';
export const RESPONSE_CODE_ATTACHED_TEXT = 'attached-text';
export const RESPONSE_CODE_CHOSE_GROUP = 'chose-group';
export const RESPONSE_CODE_STAR_YES = 'star-yes';
export const RESPONSE_CODE_STAR_NO = 'star-no';
export const RESPONSE_CODE_CATEGORY_ACTIVITY = 'category-activity';
export const RESPONSE_CODE_CATEGORY_BEHAVIOUR = 'category-behaviour';
export const RESPONSE_CODE_CATEGORY_MOOD = 'category-mood';
export const RESPONSE_CODE_CATEGORY_MEMORY = 'category-memory';
export const RESPONSE_CODE_CATEGORY_MEDICAL = 'category-medical';
export const RESPONSE_CODE_CATEGORY_CAREGIVER = 'category-caregiver';
export const RESPONSE_CODE_CATEGORY_OTHER = 'category-other';

// Disable TSLint max-line-length for rest of file because messages are naturally long and clunky
/* tslint:disable:max-line-length */

export const MESSENGER_WEBVIEW_NOTICE = 'Note: journal.lumicares.com is not accessible in Messenger. We must use other browsers such as Chrome or Safari.';

// Get Started message
export const RESPONSE_MESSAGE_GET_STARTED =
`I am Lumi 😊

I can help you record moments in your caregiving journey, recommend interesting resources and activities to help you, and summarise moments for you and your loved one.

First, create a care circle 👪 for your loved one at journal.lumicares.com.

Once you've created a care circle, you can start sharing moments with me here through pictures or text 📝

I'll do the job of keeping them safe for you 💜 You can view your collection of moments at journal.lumicares.com anytime!

${MESSENGER_WEBVIEW_NOTICE}`;

// Get started messages
export const RESPONSE_MESSAGE_CREATE_CARE_GROUP_YES =
`Create your care circle here! journal.lumicares.com

${MESSENGER_WEBVIEW_NOTICE}`;
export const RESPONSE_MESSAGE_CREATE_CARE_GROUP_NO = 'No problem! We can do this any time. I can only save your shared moments once you have a care circle. I\'m here whenever you\'re ready 😊 ';

// Welcome messages
export const RESPONSE_MESSAGE_SHARE_MOMENT_YES = 'Attach a picture from today or type your thoughts here 💬';
export const RESPONSE_MESSAGE_SHARE_MOMENT_NO = firstName => `Sure thing! I hope all is well on your end ${firstName}. Know that you aren't alone in this journey! Hear from you soon 💜`;

// Persistent menu messsages
export const RESPONSE_MESSAGE_VIEW_MOMENTS =
`View your moments any time at journal.lumicares.com!

${MESSENGER_WEBVIEW_NOTICE}`;

// Error messages
export const RESPONSE_MESSAGE_NO_CARE_GROUP = firstName =>
`Hey ${firstName}, I notice that you haven't created a Care Circle. I can only start saving your shared moments once you have created a care circle. 👪 Would you like to create one now?`;

// Handle new messages
export const RESPONSE_MESSAGE_NEW_MESSAGE_MULTIPLE_GROUPS = 'Which circle would you like to save this message to?';
export const RESPONSE_MESSAGE_NEW_MESSAGE_IMAGE = firstName =>
`Thanks for sharing that moment with me, ${firstName}. I've saved it to your Timeline. Would you like to include a description?`;
export const RESPONSE_MESSAGE_NEW_MESSAGE_TEXT = firstName =>
`Thanks for sharing that moment with me, ${firstName}. I've saved it to your Timeline. Would you like to attach a picture?`;

// Handle pre-attach responses
export const RESPONSE_MESSAGE_ATTACH_IMAGE_YES = 'Great! Could you share the picture with me? 📷';
export const RESPONSE_MESSAGE_ATTACH_TEXT_YES = 'Great! How would you describe this moment? ✏️';

// Handle post-attach responses
const RESPONSE_MESSAGE_STAR_QUESTION = 'Would you like to star this moment?';
export const RESPONSE_MESSAGE_ATTACH_NO = `Ok! ${RESPONSE_MESSAGE_STAR_QUESTION}`;
export const RESPONSE_MESSAGE_ATTACHED_IMAGE = `Thanks for sharing that picture! I have attached it to the moment description. ${RESPONSE_MESSAGE_STAR_QUESTION}`;
export const RESPONSE_MESSAGE_ATTACHED_TEXT = `Thanks for sharing that description! I have attached it to the earlier picture. ${RESPONSE_MESSAGE_STAR_QUESTION}`;

// Handle star responses
const RESPONSE_MESSAGE_CATEGORY_QUESTION = 'Which category best describes this moment?';
export const RESPONSE_MESSAGE_STARRED_YES = `Great! I have starred the message. ${RESPONSE_MESSAGE_CATEGORY_QUESTION}`;
export const RESPONSE_MESSAGE_STARRED_NO = `Sounds good! ${RESPONSE_MESSAGE_CATEGORY_QUESTION}`;

// Handle category responses
export const RESPONSE_MESSAGE_CATEGORY_1 = `Got you! I've saved your moment under category `;
export const RESPONSE_MESSAGE_CATEGORY_2 = `. All saved for you. Feel free to view your collection of moments or share another moment with me any time 💜`;

export const ROUTE_LUMI = '/lumi';
export const ROUTE_LUMI_ROOT = '/';
export const ROUTE_LUMI_PSID = '/psid';
export const ROUTE_LUMI_SAVE_IMAGE = '/save-image';
export const ROUTE_PWFN = '/pwfn';
export const ROUTE_PWFN_ROOT = '/';

export const SLACK_CHANNEL_ID_PWFN = 'C8G2S6TSN';

export const URL_PWFN_MEMBER_PREFIX = 'https://community.projectweforgot.com/members/';

export const URL_FB_GRAPH_API = 'https://graph.facebook.com/v2.6';
export const URL_FB_SEND_API = `${URL_FB_GRAPH_API}/me/messages`;
