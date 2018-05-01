import PropTypes from 'prop-types';
import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import * as constants from '../static/constants';


const GroupCreateComponent = props => (
  <div>
    <h2>{constants.GROUP_CREATE_TITLE}</h2>
    <form>
      <FormGroup
        controlId="formGroupNewGroupFirstName"
        validationState={props.groupCreateValidationState}
      >
        <ControlLabel>{constants.GROUP_NAME_FIELD_PROMPT}</ControlLabel>
        <FormControl
          type="text"
          value={props.firstNameFieldValue}
          placeholder={constants.GROUP_CREATE_FIRST_NAME_FIELD_PLACEHOLDER}
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
          placeholder={constants.GROUP_CREATE_LAST_NAME_FIELD_PLACEHOLDER}
          onChange={props.saveCareProfileLastName}
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
  firstNameFieldValue: PropTypes.string.isRequired,
  lastNameFieldValue: PropTypes.string.isRequired,
  groupCreateValidationState: PropTypes.string,
  isCreateButtonDisabled: PropTypes.bool.isRequired,
  createGroup: PropTypes.func.isRequired,
  saveCareProfileFirstName: PropTypes.func.isRequired,
  saveCareProfileLastName: PropTypes.func.isRequired,
};

GroupCreateComponent.defaultProps = {
  groupCreateValidationState: null,
};

export default GroupCreateComponent;
