import PropTypes from 'prop-types';
import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import * as constants from '../static/constants';


const GroupCreateComponent = props => (
  <div>
    <h2>{constants.GROUP_CREATE_TITLE}</h2>
    <form>
      <FormGroup
        controlId="formGroupNewGroup"
        validationState={props.groupCreateValidationState}
      >
        <ControlLabel>{constants.GROUP_NAME_FIELD_PROMPT}</ControlLabel>
        <FormControl
          type="text"
          value={props.groupNameFieldValue}
          placeholder={constants.GROUP_NAME_FIELD_PLACEHOLDER}
          onChange={props.handleChange}
        />
        <FormControl.Feedback />
        <HelpBlock>{constants.GROUP_NAME_FIELD_HELP}</HelpBlock>
      </FormGroup>
      <Button
        block
        bsSize="large"
        bsStyle="primary"
        disabled={props.isCreateButtonDisabled}
        onClick={props.createGroup}
      >
        {constants.GROUP_CREATE_BUTTON_TEXT}
      </Button>
    </form>
  </div>
);

GroupCreateComponent.propTypes = {
  groupNameFieldValue: PropTypes.string.isRequired,
  groupCreateValidationState: PropTypes.string,
  isCreateButtonDisabled: PropTypes.bool.isRequired,
  createGroup: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

GroupCreateComponent.defaultProps = {
  groupCreateValidationState: null,
};

export default GroupCreateComponent;
