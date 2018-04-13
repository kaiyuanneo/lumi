import { connect } from 'react-redux';

import * as actions from '../actions';
import TimelineFiltersComponent from '../components/TimelineFiltersComponent';
import * as constants from '../static/constants';


const mapDispatchToProps = dispatch => ({
  filterMessagesStar: (filterCategories) => {
    const starFilterValue = filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_STAR) !== -1;
    dispatch(actions.saveTimelineMessageFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_STAR]: starFilterValue,
    }));
  },
  filterMessagesAllMemory: (filterCategories) => {
    const allFilterValue = filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_ALL) !== -1;
    const memoryFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_MEMORY) !== -1;
    dispatch(actions.saveTimelineMessageFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_ALL]: allFilterValue,
      [constants.TIMELINE_CATEGORY_CODE_MEMORY]: memoryFilterValue,
    }));
  },
  filterMessagesActivityMedical: (filterCategories) => {
    const activityFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_ACTIVITY) !== -1;
    const medicalFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_MEDICAL) !== -1;
    dispatch(actions.saveTimelineMessageFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_ACTIVITY]: activityFilterValue,
      [constants.TIMELINE_CATEGORY_CODE_MEDICAL]: medicalFilterValue,
    }));
  },
  filterMessagesBehaviourCaregiver: (filterCategories) => {
    const behaviourFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR) !== -1;
    const caregiverFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_CAREGIVER) !== -1;
    dispatch(actions.saveTimelineMessageFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]: behaviourFilterValue,
      [constants.TIMELINE_CATEGORY_CODE_CAREGIVER]: caregiverFilterValue,
    }));
  },
  filterMessagesMoodOther: (filterCategories) => {
    const moodFilterValue = filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_MOOD) !== -1;
    const otherFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_OTHER) !== -1;
    dispatch(actions.saveTimelineMessageFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_MOOD]: moodFilterValue,
      [constants.TIMELINE_CATEGORY_CODE_OTHER]: otherFilterValue,
    }));
  },
});


const TimelineFiltersContainer = connect(
  null,
  mapDispatchToProps,
)(TimelineFiltersComponent);

export default TimelineFiltersContainer;
