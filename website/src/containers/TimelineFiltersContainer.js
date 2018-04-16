// NB: Private functions are underscore-prefixed and exported for tests
import { connect } from 'react-redux';

import * as actions from '../actions';
import TimelineFiltersComponent from '../components/TimelineFiltersComponent';
import * as constants from '../static/constants';


export const _getFilterDefaultValue = (state, categoryCode) => {
  if (state.timeline.messageFilterCategories[categoryCode]) {
    return categoryCode;
  }
  return '';
};


const mapStateToProps = state => ({
  showFilters: state.timeline.showFilters,
  filterMessagesStarDefaultValue: [
    _getFilterDefaultValue(state, constants.TIMELINE_CATEGORY_CODE_STAR),
  ],
  filterMessagesAllMemoryDefaultValue: [
    _getFilterDefaultValue(state, constants.TIMELINE_CATEGORY_CODE_ALL),
    _getFilterDefaultValue(state, constants.TIMELINE_CATEGORY_CODE_MEMORY),
  ],
  filterMessagesActivityMedicalDefaultValue: [
    _getFilterDefaultValue(state, constants.TIMELINE_CATEGORY_CODE_ACTIVITY),
    _getFilterDefaultValue(state, constants.TIMELINE_CATEGORY_CODE_MEDICAL),
  ],
  filterMessagesBehaviourCaregiverDefaultValue: [
    _getFilterDefaultValue(state, constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR),
    _getFilterDefaultValue(state, constants.TIMELINE_CATEGORY_CODE_CAREGIVER),
  ],
  filterMessagesMoodOtherDefaultValue: [
    _getFilterDefaultValue(state, constants.TIMELINE_CATEGORY_CODE_MOOD),
    _getFilterDefaultValue(state, constants.TIMELINE_CATEGORY_CODE_OTHER),
  ],
});


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
  toggleFilterButtons: (toggleButtonValue) => {
    // toggleButtonValue is an array of the values of the buttons currently toggled in the button
    // group. If the toggle button is on, toggleButtonValue will contain the filter button code.
    const toggleValue = toggleButtonValue.indexOf(constants.TIMELINE_BUTTON_CODE_FILTER) !== -1;
    dispatch(actions.toggleTimelineFilterButtons(toggleValue));
  },
});


const TimelineFiltersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimelineFiltersComponent);

export default TimelineFiltersContainer;
