import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Glyphicon, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import FilterIcon from 'react-icons/lib/fa/sliders';

import * as constants from '../static/constants';


const TimelineFiltersComponent = (props) => {
  const filterToggleButton = (
    <ToggleButtonGroup type="checkbox" onChange={props.toggleFilterButtons} justified>
      <ToggleButton value={constants.TIMELINE_BUTTON_CODE_FILTER}>
        <Flexbox alignItems="center" justifyContent="center">
          <FilterIcon color="purple" size={16} />
          &nbsp;
          <div className="button-text-accent">
            {props.showFilters ? 'Hide filters' : 'Show filters'}
          </div>
        </Flexbox>
      </ToggleButton>
    </ToggleButtonGroup>
  );
  const filterButtons = (
    <div>
      <br />
      <Flexbox alignItems="center" justifyContent="center">
        <ToggleButtonGroup
          defaultValue={props.filterMessagesStarDefaultValue}
          type="checkbox"
          onChange={props.filterMessagesStar}
          className="timeline-star-filter"
        >
          <ToggleButton
            bsSize="small"
            value={constants.TIMELINE_CATEGORY_CODE_STAR}
          >
            <Glyphicon glyph="star" /> Starred
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          vertical
          defaultValue={props.filterMessagesAllMemoryDefaultValue}
          type="checkbox"
          onChange={props.filterMessagesAllMemory}
        >
          <ToggleButton
            bsSize="xsmall"
            value={constants.TIMELINE_CATEGORY_CODE_ALL}
          >
            {constants.TIMELINE_CATEGORY_NAME_ALL}
          </ToggleButton>
          <ToggleButton
            bsSize="xsmall"
            value={constants.TIMELINE_CATEGORY_CODE_MEMORY}
          >
            {constants.TIMELINE_CATEGORY_NAME_MEMORY}
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          vertical
          defaultValue={props.filterMessagesActivityMedicalDefaultValue}
          type="checkbox"
          onChange={props.filterMessagesActivityMedical}
        >
          <ToggleButton
            bsSize="xsmall"
            value={constants.TIMELINE_CATEGORY_CODE_ACTIVITY}
          >
            {constants.TIMELINE_CATEGORY_NAME_ACTIVITY}
          </ToggleButton>
          <ToggleButton
            bsSize="xsmall"
            value={constants.TIMELINE_CATEGORY_CODE_MEDICAL}
          >
            {constants.TIMELINE_CATEGORY_NAME_MEDICAL}
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          vertical
          defaultValue={props.filterMessagesBehaviourCaregiverDefaultValue}
          type="checkbox"
          onChange={props.filterMessagesBehaviourCaregiver}
        >
          <ToggleButton
            bsSize="xsmall"
            value={constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR}
          >
            {constants.TIMELINE_CATEGORY_NAME_BEHAVIOUR}
          </ToggleButton>
          <ToggleButton
            bsSize="xsmall"
            value={constants.TIMELINE_CATEGORY_CODE_CAREGIVER}
          >
            {constants.TIMELINE_CATEGORY_NAME_CAREGIVER}
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          vertical
          defaultValue={props.filterMessagesMoodOtherDefaultValue}
          type="checkbox"
          onChange={props.filterMessagesMoodOther}
        >
          <ToggleButton
            bsSize="xsmall"
            value={constants.TIMELINE_CATEGORY_CODE_MOOD}
          >
            {constants.TIMELINE_CATEGORY_NAME_MOOD}
          </ToggleButton>
          <ToggleButton
            bsSize="xsmall"
            value={constants.TIMELINE_CATEGORY_CODE_OTHER}
          >
            {constants.TIMELINE_CATEGORY_NAME_OTHER}
          </ToggleButton>
        </ToggleButtonGroup>
      </Flexbox>
      <br />
    </div>
  );
  return (
    <Flexbox flexDirection="column" alignItems="center">
      {filterToggleButton}
      {props.showFilters ? filterButtons : null}
    </Flexbox>
  );
};

TimelineFiltersComponent.propTypes = {
  filterMessagesStar: PropTypes.func.isRequired,
  filterMessagesAllMemory: PropTypes.func.isRequired,
  filterMessagesActivityMedical: PropTypes.func.isRequired,
  filterMessagesBehaviourCaregiver: PropTypes.func.isRequired,
  filterMessagesMoodOther: PropTypes.func.isRequired,

  filterMessagesStarDefaultValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterMessagesAllMemoryDefaultValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterMessagesActivityMedicalDefaultValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterMessagesBehaviourCaregiverDefaultValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterMessagesMoodOtherDefaultValue: PropTypes.arrayOf(PropTypes.string).isRequired,

  showFilters: PropTypes.bool.isRequired,
  toggleFilterButtons: PropTypes.func.isRequired,
};

export default TimelineFiltersComponent;
