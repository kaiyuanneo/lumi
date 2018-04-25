// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';

import TimelineStoryHeaderComponent from '../components/TimelineStoryHeaderComponent';
import * as utils from '../utils';


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getCategoryName: categoryCode => utils.categoryCodeToName(categoryCode),
  getLocalDateString: timestamp => utils.getLocalDateString(timestamp),
});


const TimelineStoryHeaderContainer = connect(
  null,
  null,
  mergeProps,
)(TimelineStoryHeaderComponent);

export default TimelineStoryHeaderContainer;
