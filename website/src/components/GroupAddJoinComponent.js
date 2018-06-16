import PropTypes from 'prop-types';
import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import * as constants from '../static/constants';


const GroupAddJoinComponent = props => (
  <div>
    <h3>{constants.GROUP_ADD_JOIN_TITLE}</h3>
    <FormGroup
      controlId="formGroupJoinGroup"
      validationState={props.groupJoinValidationState}
    >
      <ControlLabel>{constants.GROUP_ADD_ID_FIELD_PROMPT}</ControlLabel>
      <FormControl
        type="text"
        value={props.groupIdFieldValue}
        placeholder={constants.GROUP_ADD_ID_FIELD_PLACEHOLDER}
        onChange={props.handleChange}
      />
      <FormControl.Feedback />
      <HelpBlock>{constants.GROUP_ADD_ID_FIELD_HELP}</HelpBlock>
    </FormGroup>
    <Button
      className="button-primary"
      block
      bsSize="large"
      disabled={props.isJoinButtonDisabled}
      onClick={props.joinGroup}
    >
      {constants.GROUP_ADD_JOIN_BUTTON_TEXT}
    </Button>
    <br />
    <Button
      className="button-default"
      block
      bsSize="small"
      onClick={props.clearGroupAddState}
    >
      {constants.BUTTON_TEXT_BACK}
    </Button>
  </div>
);

GroupAddJoinComponent.propTypes = {
  groupIdFieldValue: PropTypes.string.isRequired,
  groupJoinValidationState: PropTypes.string,
  isJoinButtonDisabled: PropTypes.bool.isRequired,
  joinGroup: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearGroupAddState: PropTypes.func.isRequired,
};

GroupAddJoinComponent.defaultProps = {
  groupJoinValidationState: null,
};

export default GroupAddJoinComponent;
