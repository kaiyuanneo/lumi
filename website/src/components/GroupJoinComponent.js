import PropTypes from 'prop-types';
import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import * as constants from '../static/constants';


const GroupJoinComponent = props => (
  <div>
    <h2>{constants.GROUP_JOIN_TITLE}</h2>
    <form>
      <FormGroup
        controlId="formGroupJoinGroup"
        validationState={props.groupJoinValidationState}
      >
        <ControlLabel>{constants.GROUP_ID_FIELD_PROMPT}</ControlLabel>
        <FormControl
          type="text"
          value={props.groupIdFieldValue}
          placeholder={constants.GROUP_ID_FIELD_PLACEHOLDER}
          onChange={props.handleChange}
        />
        <FormControl.Feedback />
        <HelpBlock>{constants.GROUP_ID_FIELD_HELP}</HelpBlock>
      </FormGroup>
      <Button
        block
        bsSize="large"
        disabled={props.isJoinButtonDisabled}
        onClick={props.joinGroup}
      >
        {constants.GROUP_JOIN_BUTTON_TEXT}
      </Button>
    </form>
  </div>
);

GroupJoinComponent.propTypes = {
  groupIdFieldValue: PropTypes.string.isRequired,
  groupJoinValidationState: PropTypes.string,
  isJoinButtonDisabled: PropTypes.bool.isRequired,
  joinGroup: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

GroupJoinComponent.defaultProps = {
  groupJoinValidationState: null,
};

export default GroupJoinComponent;
