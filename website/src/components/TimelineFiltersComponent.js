import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Glyphicon, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import * as constants from '../static/constants';


const TimelineFiltersComponent = props => (
  <Flexbox alignItems="center" justifyContent="center">
    <h5>Filters</h5>
    <ToggleButtonGroup
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
      defaultValue={[constants.TIMELINE_CATEGORY_CODE_ALL]}
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
);

TimelineFiltersComponent.propTypes = {
  filterMessagesStar: PropTypes.func.isRequired,
  filterMessagesAllMemory: PropTypes.func.isRequired,
  filterMessagesActivityMedical: PropTypes.func.isRequired,
  filterMessagesBehaviourCaregiver: PropTypes.func.isRequired,
  filterMessagesMoodOther: PropTypes.func.isRequired,
};

export default TimelineFiltersComponent;
