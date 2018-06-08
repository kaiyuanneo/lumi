import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';

import * as constants from '../static/constants';


/**
 * NB: Need to pass isDateField prop to all date fields so that CareProfileEditWrapperComponent
 * calls the relevant handleChange function
 */
const CareProfileEditWrapperComponent = (props) => {
  // If edit mode is on, render the form field
  if (props.isInEditMode) {
    return (
      <tr>
        <td>{props.title}</td>
        <td>{props.formField}</td>
        <td>
          <Flexbox>
            <ButtonToolbar>
              <Button
                bsStyle="primary"
                disabled={props.saveButtonDisabled}
                onClick={props.saveFieldValueToDb}
              >
                {constants.BUTTON_TEXT_SAVE}
              </Button>
              <Button onClick={props.cancelEdits}>
                {constants.BUTTON_TEXT_CANCEL}
              </Button>
            </ButtonToolbar>
          </Flexbox>
        </td>
      </tr>
    );
  }
  // Otherwise, render the field value
  return (
    <tr>
      <td>{props.title}</td>
      <td>{props.displayFieldValue}</td>
      <td>
        <Button onClick={props.enterEditMode}>
          <Glyphicon className="button-icon" glyph="pencil" />
          {constants.BUTTON_TEXT_EDIT}
        </Button>
      </td>
    </tr>
  );
};

CareProfileEditWrapperComponent.propTypes = {
  // Flag to display form field or display field value
  isInEditMode: PropTypes.bool.isRequired,

  // Display elements
  title: PropTypes.string.isRequired,
  formField: PropTypes.element.isRequired,
  saveButtonDisabled: PropTypes.bool.isRequired,
  displayFieldValue: PropTypes.string.isRequired,

  // Functions to control state
  enterEditMode: PropTypes.func.isRequired,
  cancelEdits: PropTypes.func.isRequired,
  saveFieldValueToDb: PropTypes.func.isRequired,
};

export default CareProfileEditWrapperComponent;
