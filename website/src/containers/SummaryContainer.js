// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';

import SummaryComponent from '../components/SummaryComponent';
import * as constants from '../static/constants';
import * as momentUtils from '../utils/momentUtils';


export const _getFilterStats = (state) => {
  const filterStats = {
    [constants.TIMELINE_CATEGORY_CODE_STAR]: 0,
    [constants.TIMELINE_CATEGORY_CODE_ACTIVITY]: 0,
    [constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]: 0,
    [constants.TIMELINE_CATEGORY_CODE_MOOD]: 0,
    [constants.TIMELINE_CATEGORY_CODE_MEMORY]: 0,
    [constants.TIMELINE_CATEGORY_CODE_MEDICAL]: 0,
    [constants.TIMELINE_CATEGORY_CODE_CAREGIVER]: 0,
    [constants.TIMELINE_CATEGORY_CODE_OTHER]: 0,
  };
  Object.keys(state.timeline.messages).forEach((messageKey) => {
    const message = state.timeline.messages[messageKey];
    if (message.starred) {
      filterStats[constants.TIMELINE_CATEGORY_CODE_STAR] += 1;
    }
    filterStats[message.category] += 1;
  });
  return filterStats;
};


const mapStateToProps = state => ({
  groupName: state.home.groupName,
  numMessages: Object.keys(state.timeline.messages).length,
  // filterStats is an object with filter name as key and frequency of filter as value.
  filterStats: _getFilterStats(state),
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
