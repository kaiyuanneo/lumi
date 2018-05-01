// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';

import SummaryComponent from '../components/SummaryComponent';
import * as constants from '../static/constants';
import * as momentUtils from '../utils/momentUtils';


export const _getMessageStats = (state) => {
  const messageStats = {
    numMessages: 0,
    [constants.TIMELINE_CATEGORY_CODE_STAR]: 0,
    [constants.TIMELINE_CATEGORY_CODE_ACTIVITY]: 0,
    [constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]: 0,
    [constants.TIMELINE_CATEGORY_CODE_MOOD]: 0,
    [constants.TIMELINE_CATEGORY_CODE_MEMORY]: 0,
    [constants.TIMELINE_CATEGORY_CODE_MEDICAL]: 0,
    [constants.TIMELINE_CATEGORY_CODE_CAREGIVER]: 0,
    [constants.TIMELINE_CATEGORY_CODE_OTHER]: 0,
    allImages: [],
    [`${constants.TIMELINE_CATEGORY_CODE_STAR}Images`]: [],
    [`${constants.TIMELINE_CATEGORY_CODE_ACTIVITY}Images`]: [],
    [`${constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR}Images`]: [],
    [`${constants.TIMELINE_CATEGORY_CODE_MOOD}Images`]: [],
    [`${constants.TIMELINE_CATEGORY_CODE_MEMORY}Images`]: [],
    [`${constants.TIMELINE_CATEGORY_CODE_MEDICAL}Images`]: [],
    [`${constants.TIMELINE_CATEGORY_CODE_CAREGIVER}Images`]: [],
    [`${constants.TIMELINE_CATEGORY_CODE_OTHER}Images`]: [],
  };
  const messageKeys = Object.keys(state.timeline.messages);
  messageStats.numMessages = messageKeys.length;

  messageKeys.forEach((messageKey) => {
    const message = state.timeline.messages[messageKey];
    if (message.starred) {
      messageStats[constants.TIMELINE_CATEGORY_CODE_STAR] += 1;
    }
    messageStats[message.category] += 1;
    if (message.attachments) {
      const messageImage = message.attachments['0'].payload.url;
      // TODO(kai): Remove this escape once we have gotten rid of all old FBCDN URLs for images
      // Only render images that are not FBCDN images
      if (messageImage.indexOf('fbcdn') < 0) {
        messageStats.allImages.push(messageImage);
        if (message.starred) {
          messageStats[`${constants.TIMELINE_CATEGORY_CODE_STAR}Images`].push(messageImage);
        }
        messageStats[`${message.category}Images`].push(messageImage);
      }
    }
  });
  return messageStats;
};


const mapStateToProps = state => ({
  groupName: state.home.groupName,
  // Initial value in state is null to indicate that messages have not been fetched yet
  numMessagesState: state.timeline.numMessages,
  // messageStats is an object with the following as keys and values:
  // - filter code as key and frequency of filter as value
  // - filter code with suffix "Images" as key and array of images from that filter as value
  messageStats: _getMessageStats(state),
});


const mapDispatchToProps = dispatch => ({
  // Sync local message state with auth user message state in Firebase
  syncMessages: () => momentUtils.syncMessages(dispatch),
});


const SummaryContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SummaryComponent);

export default SummaryContainer;
