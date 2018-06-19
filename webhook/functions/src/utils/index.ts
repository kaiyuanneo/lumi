import * as functions from 'firebase-functions';
import * as rp from 'request-promise';

import * as constants from '../static/constants';


// Get relevant app access token based on environment at deploy time
export const getAppAccessToken = () => functions.config().lumi.env === constants.ENV_PROD ?
  functions.config().lumi.token_app_access :
  functions.config().lumi.token_app_access_staging;


// Get relevant page access token based on environment at deploy time
export const getPageAccessToken = () => functions.config().lumi.env === constants.ENV_PROD ?
  functions.config().lumi.token_page_access :
  functions.config().lumi.token_page_access_staging;


// TODO(kai): Write unit tests
export const getUserFirstName = async (senderPsid) => {
  // Get first name from FB Graph API
  const firstNameRequestOptions = {
    uri: `${constants.URL_FB_GRAPH_API}/${senderPsid}`,
    qs: {
      fields: 'first_name',
      access_token: getPageAccessToken(),
    },
    json: true,
  };
  const firstNameParsedBody = await rp(firstNameRequestOptions);
  return firstNameParsedBody.first_name;
};


export const responseCodeToMessageCategoryCode = (responseCode) => {
  switch (responseCode) {
    case constants.RESPONSE_CODE_CATEGORY_ACTIVITY:
      return constants.MESSAGE_CATEGORY_CODE_ACTIVITY;
    case constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR:
      return constants.MESSAGE_CATEGORY_CODE_BEHAVIOUR;
    case constants.RESPONSE_CODE_CATEGORY_MOOD:
      return constants.MESSAGE_CATEGORY_CODE_MOOD;
    case constants.RESPONSE_CODE_CATEGORY_MEMORY:
      return constants.MESSAGE_CATEGORY_CODE_MEMORY;
    case constants.RESPONSE_CODE_CATEGORY_MEDICAL:
      return constants.MESSAGE_CATEGORY_CODE_MEDICAL;
    case constants.RESPONSE_CODE_CATEGORY_CAREGIVER:
      return constants.MESSAGE_CATEGORY_CODE_CAREGIVER;
    case constants.RESPONSE_CODE_CATEGORY_OTHER:
      return constants.MESSAGE_CATEGORY_CODE_OTHER;
    default:
      console.error('Client passed unrecognised response code');
      return 'NA';
  }
};


export const responseCodeToQuickReplyTitle = (responseCode) => {
  switch (responseCode) {
    // All yes and no options share the same quick reply titles
    case constants.RESPONSE_CODE_ATTACH_IMAGE_YES:
    case constants.RESPONSE_CODE_ATTACH_TEXT_YES:
    case constants.RESPONSE_CODE_STAR_YES:
      return constants.QUICK_REPLY_TITLE_YES;
    case constants.RESPONSE_CODE_ATTACH_IMAGE_NO:
    case constants.RESPONSE_CODE_ATTACH_TEXT_NO:
    case constants.RESPONSE_CODE_STAR_NO:
      return constants.QUICK_REPLY_TITLE_NO;
    case constants.RESPONSE_CODE_CATEGORY_ACTIVITY:
      return constants.QUICK_REPLY_TITLE_CATEGORY_ACTIVITY;
    case constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR:
      return constants.QUICK_REPLY_TITLE_CATEGORY_BEHAVIOUR;
    case constants.RESPONSE_CODE_CATEGORY_MOOD:
      return constants.QUICK_REPLY_TITLE_CATEGORY_MOOD;
    case constants.RESPONSE_CODE_CATEGORY_MEMORY:
      return constants.QUICK_REPLY_TITLE_CATEGORY_MEMORY;
    case constants.RESPONSE_CODE_CATEGORY_MEDICAL:
      return constants.QUICK_REPLY_TITLE_CATEGORY_MEDICAL;
    case constants.RESPONSE_CODE_CATEGORY_CAREGIVER:
      return constants.QUICK_REPLY_TITLE_CATEGORY_CAREGIVER;
    case constants.RESPONSE_CODE_CATEGORY_OTHER:
      return constants.QUICK_REPLY_TITLE_CATEGORY_OTHER;
    default:
      console.error('Client passed unrecognised response code');
      return 'NA';
  }
};


export const responseCodeToResponseMessage = async (
  receivedResponseCode,
  webhookEvent = null,
  userGroups = null,
  isOriginalMessageText = null,
) => {
  if (receivedResponseCode === constants.RESPONSE_CODE_NEW_MESSAGE && userGroups) {
    return constants.RESPONSE_MESSAGE_NEW_MESSAGE_MULTIPLE_GROUPS;
  }
  if (receivedResponseCode.indexOf('category') >= 0) {
    return (
      constants.RESPONSE_MESSAGE_CATEGORY_1 +
      responseCodeToQuickReplyTitle(receivedResponseCode) +
      constants.RESPONSE_MESSAGE_CATEGORY_2
    );
  }
  const senderPsid = webhookEvent.sender.id;
  if (!senderPsid) {
    console.error('No sender PSID to respond to');
  }
  const firstName = await getUserFirstName(senderPsid);
  switch (receivedResponseCode) {
    // TODO(kai): Write tests for care group and share moment responses
    // Create care group responses
    case constants.RESPONSE_CODE_CREATE_CARE_GROUP_YES:
      return constants.RESPONSE_MESSAGE_CREATE_CARE_GROUP_YES;
    case constants.RESPONSE_CODE_CREATE_CARE_GROUP_NO:
      return constants.RESPONSE_MESSAGE_CREATE_CARE_GROUP_NO;

    // Share moment responses
    case constants.RESPONSE_CODE_SHARE_MOMENT_YES: {
      return constants.RESPONSE_MESSAGE_SHARE_MOMENT_YES;
    }
    case constants.RESPONSE_CODE_SHARE_MOMENT_NO: {
      return constants.RESPONSE_MESSAGE_SHARE_MOMENT_NO(firstName);
    }
    // Share moment sequence responses
    case constants.RESPONSE_CODE_CHOSE_GROUP:
      // If original message is text, respond one way
      if (isOriginalMessageText) {
        return constants.RESPONSE_MESSAGE_NEW_MESSAGE_TEXT(firstName);
      }
      // Else if original message is image, respond another way
      return constants.RESPONSE_MESSAGE_NEW_MESSAGE_IMAGE(firstName);
    case constants.RESPONSE_CODE_NEW_MESSAGE:
      // If new message is text, respond one way
      if ('text' in webhookEvent.message) {
        return constants.RESPONSE_MESSAGE_NEW_MESSAGE_TEXT(firstName);
      }
      // Else if new message is image, respond another way
      return constants.RESPONSE_MESSAGE_NEW_MESSAGE_IMAGE(firstName);
    case constants.RESPONSE_CODE_ATTACH_IMAGE_YES:
      return constants.RESPONSE_MESSAGE_ATTACH_IMAGE_YES;
    case constants.RESPONSE_CODE_ATTACH_TEXT_YES:
      return constants.RESPONSE_MESSAGE_ATTACH_TEXT_YES;
    // Both attach-image-no and attach-text-no have the same response
    case constants.RESPONSE_CODE_ATTACH_IMAGE_NO:
    case constants.RESPONSE_CODE_ATTACH_TEXT_NO:
      return constants.RESPONSE_MESSAGE_ATTACH_NO;
    case constants.RESPONSE_CODE_ATTACHED_IMAGE:
      return constants.RESPONSE_MESSAGE_ATTACHED_IMAGE;
    case constants.RESPONSE_CODE_ATTACHED_TEXT:
      return constants.RESPONSE_MESSAGE_ATTACHED_TEXT;
    case constants.RESPONSE_CODE_STAR_YES:
      return constants.RESPONSE_MESSAGE_STARRED_YES;
    case constants.RESPONSE_CODE_STAR_NO:
      return constants.RESPONSE_MESSAGE_STARRED_NO;
    default:
      console.error('Response code does not map to any response message');
      return constants.DEFAULT_ERROR_MESSAGE;
  }
};
