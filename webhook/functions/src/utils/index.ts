import * as constants from '../static/constants';


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
      return 'na';
  }
};

export const responseCodeToQuickReplyTitle = (responseCode) => {
  switch (responseCode) {
    case constants.RESPONSE_CODE_SHOW_MESSAGE_YES:
      return constants.QUICK_REPLY_TITLE_YES;
    case constants.RESPONSE_CODE_SHOW_MESSAGE_NO:
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

export const responseCodeToResponseMessage = (responseCode, receivedMessage = null) => {
  if (responseCode.indexOf('category') >= 0) {
    return (
      constants.RESPONSE_MESSAGE_CATEGORY_1 +
      responseCodeToQuickReplyTitle(responseCode) +
      constants.RESPONSE_MESSAGE_CATEGORY_2
    );
  }
  switch (responseCode) {
    case constants.RESPONSE_CODE_NEW_MESSAGE:
      return (
        constants.RESPONSE_MESSAGE_NEW_MESSAGE_1 +
        receivedMessage.text +
        constants.RESPONSE_MESSAGE_NEW_MESSAGE_2
      );
    case constants.RESPONSE_CODE_SHOW_MESSAGE_YES:
      return constants.RESPONSE_MESSAGE_SHOW_MESSAGE_YES;
    case constants.RESPONSE_CODE_SHOW_MESSAGE_NO:
      return constants.RESPONSE_MESSAGE_SHOW_MESSAGE_NO;
    default:
      console.error('Response code does not map to any response message');
      return 'Oops! Something went wrong. We will fix this as soon as possible!';
  }
};
