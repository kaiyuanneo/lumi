import * as constants from '../static/constants';


export const categoryCodeToName = (categoryCode) => {
  switch (categoryCode) {
    case constants.TIMELINE_CATEGORY_CODE_ALL:
      return constants.TIMELINE_CATEGORY_NAME_ALL;
    case constants.TIMELINE_CATEGORY_CODE_ACTIVITY:
      return constants.TIMELINE_CATEGORY_NAME_ACTIVITY;
    case constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR:
      return constants.TIMELINE_CATEGORY_NAME_BEHAVIOUR;
    case constants.TIMELINE_CATEGORY_CODE_MOOD:
      return constants.TIMELINE_CATEGORY_NAME_MOOD;
    case constants.TIMELINE_CATEGORY_CODE_MEMORY:
      return constants.TIMELINE_CATEGORY_NAME_MEMORY;
    case constants.TIMELINE_CATEGORY_CODE_MEDICAL:
      return constants.TIMELINE_CATEGORY_NAME_MEDICAL;
    case constants.TIMELINE_CATEGORY_CODE_CAREGIVER:
      return constants.TIMELINE_CATEGORY_NAME_CAREGIVER;
    case constants.TIMELINE_CATEGORY_CODE_OTHER:
      return constants.TIMELINE_CATEGORY_NAME_OTHER;
    default:
      return 'NA';
  }
};
