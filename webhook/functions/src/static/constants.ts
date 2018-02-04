export const DB_PATH_LUMI_MESSAGES = 'lumi-messages';
export const DB_PATH_PWFN_MESSAGES = 'pwfn-messages';

export const MESSAGE_CATEGORY_CODE_GENERAL = 'general';
export const MESSAGE_CATEGORY_CODE_BEHAVIOUR = 'behaviour';
export const MESSAGE_CATEGORY_CODE_MEMORY = 'memory';
export const MESSAGE_CATEGORY_CODE_MEDICAL = 'medical';

export const MESSAGE_WEBHOOK_STARTUP = 'Webhook is listening';

export const PAGE_ID_LUMI = '159838238099782';

export const PORT = 1337;

export const QUICK_REPLY_CONTENT_TYPE_TEXT = 'text';

export const QUICK_REPLY_TITLE_YES = 'Yes';
export const QUICK_REPLY_TITLE_NO = 'No';
export const QUICK_REPLY_TITLE_CATEGORY_GENERAL = 'General';
export const QUICK_REPLY_TITLE_CATEGORY_BEHAVIOUR = 'Behaviour';
export const QUICK_REPLY_TITLE_CATEGORY_MEMORY = 'Memory';
export const QUICK_REPLY_TITLE_CATEGORY_MEDICAL = 'Medical';

export const RESPONSE_CODE_NEW_MESSAGE = 'new-message';
export const RESPONSE_CODE_SHOW_MESSAGE_YES = 'show-message-yes';
export const RESPONSE_CODE_SHOW_MESSAGE_NO = 'show-message-no';
export const RESPONSE_CODE_CATEGORY_GENERAL = 'category-general';
export const RESPONSE_CODE_CATEGORY_BEHAVIOUR = 'category-behaviour';
export const RESPONSE_CODE_CATEGORY_MEMORY = 'category-memory';
export const RESPONSE_CODE_CATEGORY_MEDICAL = 'category-medical';
export const RESPONSE_CODE_ATTACH_PHOTO_YES = 'attach-photo-yes';
export const RESPONSE_CODE_ATTACH_PHOTO_NO = 'attach-photo-no';

export const RESPONSE_MESSAGE_NEW_MESSAGE = messageText =>
  `You sent the message "${messageText}". ` +
  'Would you like to save it to your Lumi Timeline? ' +
  'You can view all your saved messages at lumicares.com!';
export const RESPONSE_MESSAGE_SHOW_MESSAGE_YES = 'Ok! Which category?';
export const RESPONSE_MESSAGE_SHOW_MESSAGE_NO = 'Ok! Great to hear from you :)';
export const RESPONSE_MESSAGE_CATEGORY = categoryName =>
  `Great! Saved under category ${categoryName}. Would you like to attach a photo?`;
export const RESPONSE_MESSAGE_SAVE_MESSAGE =
  'Ok! I\'ve saved this message to your Lumi Timeline! ' +
  'You can access your Timeline any time at lumicares.com.';

export const ROUTE_LUMI = '/lumi';
export const ROUTE_LUMI_ROOT = '/';
export const ROUTE_LUMI_PSID = '/psid';
export const ROUTE_PWFN = '/pwfn';
export const ROUTE_PWFN_ROOT = '/';

export const SLACK_CHANNEL_ID_PWFN = 'C8G2S6TSN';

export const URL_PWFN_MEMBER_PREFIX = 'https://community.projectweforgot.com/members/';

export const URL_FB_GRAPH_API = 'https://graph.facebook.com/v2.6';
export const URL_FB_SEND_API = `${URL_FB_GRAPH_API}/me/messages`;
