import PropTypes from 'prop-types';
import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import * as constants from '../static/constants';


const GroupAddCreateComponent = props => (
  <div>
    <h3>{constants.GROUP_ADD_CREATE_TITLE}</h3>
    <FormGroup
      controlId="formGroupNewGroupFirstName"
      validationState={props.groupCreateValidationState}
    >
      <ControlLabel>{constants.GROUP_ADD_NAME_FIELD_PROMPT}</ControlLabel>
      <FormControl
        type="text"
        value={props.firstNameFieldValue}
        placeholder={constants.GROUP_ADD_CREATE_FIRST_NAME_FIELD_PLACEHOLDER}
        onChange={props.saveCareProfileFirstName}
      />
      <FormControl.Feedback />
    </FormGroup>
    <FormGroup
      controlId="formGroupNewGroupLastName"
      validationState={props.groupCreateValidationState}
    >
      <FormControl
        type="text"
        value={props.lastNameFieldValue}
        placeholder={constants.GROUP_ADD_CREATE_LAST_NAME_FIELD_PLACEHOLDER}
        onChange={props.saveCareProfileLastName}
      />
      <FormControl.Feedback />
      <HelpBlock>{constants.GROUP_ADD_NAME_FIELD_HELP}</HelpBlock>
    </FormGroup>
    <Button
      className="button-primary"
      block
      bsSize="large"
      disabled={props.isCreateButtonDisabled}
      onClick={props.createGroup}
    >
      {constants.GROUP_ADD_CREATE_BUTTON_TEXT}
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

GroupAddCreateComponent.propTypes = {
  firstNameFieldValue: PropTypes.string.isRequired,
  lastNameFieldValue: PropTypes.string.isRequired,
  groupCreateValidationState: PropTypes.string,
  isCreateButtonDisabled: PropTypes.bool.isRequired,
  createGroup: PropTypes.func.isRequired,
  saveCareProfileFirstName: PropTypes.func.isRequired,
  saveCareProfileLastName: PropTypes.func.isRequired,
  clearGroupAddState: PropTypes.func.isRequired,
};

GroupAddCreateComponent.defaultProps = {
  groupCreateValidationState: null,
};

export default GroupAddCreateComponent;
