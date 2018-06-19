// NB: Private functions are underscore-prefixed and exported for tests
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import * as actions from '../actions';
import TimelineFiltersComponent from '../components/TimelineFiltersComponent';
import * as constants from '../static/constants';


export const _getFilterDefaultValue = (state, categoryCode) => {
  if (state.timeline.filterCategories[categoryCode]) {
    return categoryCode;
  }
  return '';
};


const mapStateToProps = state => ({
  showFilters: state.timeline.showFilters,
  // Default is used loosely to mean the value to initialise the filters with. This can
  // change based on the most recent filter values before navigating away from Timeline.
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
    let toggleAction;
    const starFilterValue = filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_STAR) !== -1;
    if (starFilterValue) {
      toggleAction = constants.GA_ACTION_TOGGLE_FILTER_STAR_ON;
    } else {
      toggleAction = constants.GA_ACTION_TOGGLE_FILTER_STAR_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: toggleAction,
    });
    dispatch(actions.saveTimelineFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_STAR]: starFilterValue,
    }));
  },
  filterMessagesAllMemory: (filterCategories) => {
    const allFilterValue = filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_ALL) !== -1;
    let allToggleAction;
    if (allFilterValue) {
      allToggleAction = constants.GA_ACTION_TOGGLE_FILTER_ALL_ON;
    } else {
      allToggleAction = constants.GA_ACTION_TOGGLE_FILTER_ALL_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: allToggleAction,
    });
    const memoryFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_MEMORY) !== -1;
    let memoryToggleAction;
    if (memoryFilterValue) {
      memoryToggleAction = constants.GA_ACTION_TOGGLE_FILTER_MEMORY_ON;
    } else {
      memoryToggleAction = constants.GA_ACTION_TOGGLE_FILTER_MEMORY_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: memoryToggleAction,
    });
    dispatch(actions.saveTimelineFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_ALL]: allFilterValue,
      [constants.TIMELINE_CATEGORY_CODE_MEMORY]: memoryFilterValue,
    }));
  },
  filterMessagesActivityMedical: (filterCategories) => {
    const activityFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_ACTIVITY) !== -1;
    let activityToggleAction;
    if (activityFilterValue) {
      activityToggleAction = constants.GA_ACTION_TOGGLE_FILTER_ACTIVITY_ON;
    } else {
      activityToggleAction = constants.GA_ACTION_TOGGLE_FILTER_ACTIVITY_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: activityToggleAction,
    });
    const medicalFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_MEDICAL) !== -1;
    let medicalToggleAction;
    if (medicalFilterValue) {
      medicalToggleAction = constants.GA_ACTION_TOGGLE_FILTER_MEDICAL_ON;
    } else {
      medicalToggleAction = constants.GA_ACTION_TOGGLE_FILTER_MEDICAL_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: medicalToggleAction,
    });
    dispatch(actions.saveTimelineFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_ACTIVITY]: activityFilterValue,
      [constants.TIMELINE_CATEGORY_CODE_MEDICAL]: medicalFilterValue,
    }));
  },
  filterMessagesBehaviourCaregiver: (filterCategories) => {
    const behaviourFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR) !== -1;
    let behaviourToggleAction;
    if (behaviourFilterValue) {
      behaviourToggleAction = constants.GA_ACTION_TOGGLE_FILTER_BEHAVIOUR_ON;
    } else {
      behaviourToggleAction = constants.GA_ACTION_TOGGLE_FILTER_BEHAVIOUR_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: behaviourToggleAction,
    });
    const caregiverFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_CAREGIVER) !== -1;
    let caregiverToggleAction;
    if (caregiverFilterValue) {
      caregiverToggleAction = constants.GA_ACTION_TOGGLE_FILTER_CAREGIVER_ON;
    } else {
      caregiverToggleAction = constants.GA_ACTION_TOGGLE_FILTER_CAREGIVER_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: caregiverToggleAction,
    });
    dispatch(actions.saveTimelineFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]: behaviourFilterValue,
      [constants.TIMELINE_CATEGORY_CODE_CAREGIVER]: caregiverFilterValue,
    }));
  },
  filterMessagesMoodOther: (filterCategories) => {
    const moodFilterValue = filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_MOOD) !== -1;
    let moodToggleAction;
    if (moodFilterValue) {
      moodToggleAction = constants.GA_ACTION_TOGGLE_FILTER_MOOD_ON;
    } else {
      moodToggleAction = constants.GA_ACTION_TOGGLE_FILTER_MOOD_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: moodToggleAction,
    });
    const otherFilterValue =
      filterCategories.indexOf(constants.TIMELINE_CATEGORY_CODE_OTHER) !== -1;
    let otherToggleAction;
    if (otherFilterValue) {
      otherToggleAction = constants.GA_ACTION_TOGGLE_FILTER_OTHER_ON;
    } else {
      otherToggleAction = constants.GA_ACTION_TOGGLE_FILTER_OTHER_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: otherToggleAction,
    });
    dispatch(actions.saveTimelineFilterCategories({
      [constants.TIMELINE_CATEGORY_CODE_MOOD]: moodFilterValue,
      [constants.TIMELINE_CATEGORY_CODE_OTHER]: otherFilterValue,
    }));
  },
  toggleFilterButtons: (toggleButtonValue) => {
    let toggleAction;
    // toggleButtonValue is an array of the values of the buttons currently toggled in the button
    // group. If the toggle button is on, toggleButtonValue will contain the filter button code.
    const toggleValue = toggleButtonValue.indexOf(constants.TIMELINE_BUTTON_CODE_FILTER) !== -1;
    if (toggleValue) {
      toggleAction = constants.GA_ACTION_TOGGLE_FILTER_BUTTONS_ON;
    } else {
      toggleAction = constants.GA_ACTION_TOGGLE_FILTER_BUTTONS_OFF;
    }
    ReactGA.event({
      category: constants.GA_CATEGORY_TIMELINE,
      action: toggleAction,
    });
    dispatch(actions.toggleTimelineFilterButtons(toggleValue));
  },
});


const TimelineFiltersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimelineFiltersComponent);

export default TimelineFiltersContainer;
