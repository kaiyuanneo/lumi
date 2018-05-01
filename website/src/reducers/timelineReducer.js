import * as constants from '../static/constants';

/*
Timeline state structure
{
  // Initial value of null is sentinel to determine if messages have been fetched yet
  numMessages
  // Object where keys are message IDs and values are message content
  messages,
  // Object where keys are category codes and values are true or false
  filterCategories,
  // Boolean to determine if frontend displays message filters
  showFilters
}
*/

const initialState = {
  numMessages: null,
  messages: {},
  filterCategories: {
    [constants.TIMELINE_CATEGORY_CODE_STAR]: false,
    [constants.TIMELINE_CATEGORY_CODE_ALL]: true,
    [constants.TIMELINE_CATEGORY_CODE_ACTIVITY]: false,
    [constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]: false,
    [constants.TIMELINE_CATEGORY_CODE_MOOD]: false,
    [constants.TIMELINE_CATEGORY_CODE_MEMORY]: false,
    [constants.TIMELINE_CATEGORY_CODE_MEDICAL]: false,
    [constants.TIMELINE_CATEGORY_CODE_CAREGIVER]: false,
    [constants.TIMELINE_CATEGORY_CODE_OTHER]: false,
  },
  showFilters: false,
};

const timelineReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ACTION_SAVE_TIMELINE_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          ...action.message,
        },
      };
    case constants.ACTION_DELETE_TIMELINE_MESSAGE: {
      const { messages } = state;
      delete messages[action.message.key];
      // Trigger re-render
      return {
        ...state,
        messages: {
          ...messages,
        },
      };
    }
    case constants.ACTION_SAVE_TIMELINE_FILTER_CATEGORIES:
      // If user selects "All", deselect all other filters
      if (
        constants.TIMELINE_CATEGORY_CODE_ALL in action.filterCategories &&
        action.filterCategories[constants.TIMELINE_CATEGORY_CODE_ALL] &&
        // Only clear non-"All" filters if "All" filter was not previously selected
        !state.filterCategories[constants.TIMELINE_CATEGORY_CODE_ALL]
      ) {
        return {
          ...state,
          filterCategories: { ...initialState.filterCategories },
        };
      }
      // If user selects any other category, deselect the "All" filter
      return {
        ...state,
        filterCategories: {
          ...state.filterCategories,
          ...action.filterCategories,
          [constants.TIMELINE_CATEGORY_CODE_ALL]: false,
        },
      };
    case constants.ACTION_TOGGLE_TIMELINE_FILTER_BUTTONS:
      return {
        ...state,
        showFilters: action.showFilters,
      };
    case constants.ACTION_SAVE_NUM_MESSAGES:
      return {
        ...state,
        numMessages: action.numMessages,
      };
    default:
      return state;
  }
};

export default timelineReducer;
