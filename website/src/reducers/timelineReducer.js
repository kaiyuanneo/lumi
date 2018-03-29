import * as constants from '../static/constants';

/*
Timeline state structure
{
  messages,
  messageFilterCategory,
}
*/

const initialState = {
  messages: {},
  messageFilterCategory: constants.TIMELINE_CATEGORY_CODE_ALL,
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
    case constants.ACTION_DELETE_TIMELINE_MESSAGE:
      state.messages.delete(action.message.key);
      // Trigger re-render
      return {
        ...state,
      };
    case constants.ACTION_SAVE_TIMELINE_MESSAGE_FILTER_CATEGORY:
      return {
        ...state,
        messageFilterCategory: action.category,
      };
    default:
      return state;
  }
};

export default timelineReducer;
