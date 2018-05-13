// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';

import TimelineStoryFooterComponent from '../components/TimelineStoryFooterComponent';
import * as baseUtils from '../utils/baseUtils';


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getCategoryName: categoryCode => baseUtils.categoryCodeToName(categoryCode),
});


const TimelineStoryFooterContainer = connect(
  null,
  null,
  mergeProps,
)(TimelineStoryFooterComponent);

export default TimelineStoryFooterContainer;
