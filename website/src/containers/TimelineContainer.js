// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';

import TimelineComponent from '../components/TimelineComponent';
import * as constants from '../static/constants';
import * as baseUtils from '../utils/baseUtils';
import * as momentUtils from '../utils/momentUtils';


export const _getSortedMessageMap = (state) => {
  const sortedMessageKeys = Object.keys(state.timeline.messages).sort().reverse();
  const sortedMessageMap = new Map();
  for (let i = 0; i < sortedMessageKeys.length; i += 1) {
    sortedMessageMap.set(sortedMessageKeys[i], state.timeline.messages[sortedMessageKeys[i]]);
  }
  return sortedMessageMap;
};


export const _shouldRenderMessage = (state, message) => {
  if (!message.showInTimeline) {
    return false;
  }
  if (state.timeline.filterCategories[constants.TIMELINE_CATEGORY_CODE_ALL]) {
    return true;
  }
  if (state.timeline.filterCategories[message.category]) {
    return true;
  }
  if (message.starred &&
      state.timeline.filterCategories[constants.TIMELINE_CATEGORY_CODE_STAR]) {
    return true;
  }
  return false;
};


const mapStateToProps = state => ({
  groupName: state.group.groupName,
  // Initial value in state is null to indicate that messages have not been fetched yet
  numMessagesState: state.timeline.numMessages,
  numMessages: Object.keys(state.timeline.messages).length,
  // Order messages in descending order with newest messages first
  // We cannot depend on messages to come in order from realtime database because it takes
  // varying amounts of time to look up user information for the sender of each message.
  sortedMessages: _getSortedMessageMap(state),
  shouldRenderMessage: message => _shouldRenderMessage(state, message),
  windowWidth: state.home.windowWidth,
});


const mapDispatchToProps = dispatch => ({
  // Sync local message state with auth user message state in Firebase
  // Re-sync whenever the auth user's active group changes
  syncMessages: () => momentUtils.syncMessages(dispatch),
});


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getCategoryName: categoryCode => baseUtils.categoryCodeToName(categoryCode),
  getLocalDateString: timestamp => baseUtils.getLocalDateString(timestamp),
});


const TimelineContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(TimelineComponent);

export default TimelineContainer;
