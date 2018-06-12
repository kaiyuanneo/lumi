// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';

import TimelineStoryHeaderComponent from '../components/TimelineStoryHeaderComponent';
import * as baseUtils from '../utils/baseUtils';


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getDateString: timestamp => baseUtils.getDateString(timestamp),
});


const TimelineStoryHeaderContainer = connect(
  null,
  null,
  mergeProps,
)(TimelineStoryHeaderComponent);

export default TimelineStoryHeaderContainer;
