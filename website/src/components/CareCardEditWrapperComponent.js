import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import hash from 'string-hash';

import * as constants from '../static/constants';
import * as utils from '../utils';


/**
 * NB: Need to pass isDateField prop to all date fields so that CareCardEditWrapperComponent
 * calls the relevant handleChange function
 */
class CareCardEditWrapperComponent extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.state = {
      editable: false,
      value: this.props.initialValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.initialValue) {
      this.setState({
        ...this.state,
        value: nextProps.initialValue,
      });
    }
  }

  handleChange(e) {
    this.setState({
      ...this.state,
      value: e.target.value,
    });
  }
  handleChangeDate(value, formattedValue) {
    this.setState({
      ...this.state,
      value: formattedValue,
    });
  }

  // NB: All data that overlaps with public data from the care recipient's Facebook profile
  // will be overwritten the next time the care recipient logs in with Facebook
  handleClickSave() {
    // Save field value to user record
    // Assume there is an active care recipient if user is seeing this component
    const db = firebase.database();
    const authUid = firebase.auth().currentUser.uid;
    const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
    activeGroupRef.once(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
      // activeCareRecipient field in DB stores the UID of the currently active care recipient
      const careRecipientUidRef =
        db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupSnapshot.val()}/activeCareRecipient`);
      careRecipientUidRef.once(constants.DB_EVENT_NAME_VALUE, async (careRecipientUidSnapshot) => {
        const careRecipientUid = careRecipientUidSnapshot.val();
        const careRecipientRef = db.ref(`${constants.DB_PATH_USERS}/${careRecipientUid}`);
        let fieldValue = this.state.value;
        // If user has not changed the default value in the dropdown menu, Lumi will not have
        // populated the default value into this.state.value. Thus, save the default value to
        // DB instead of the empty initial value.
        if (!fieldValue) {
          if (this.props.fieldId === constants.CARE_CARD_FIELD_ID_GENDER) {
            fieldValue = constants.CARE_CARD_GENDER_CODE_MALE;
          } else if (this.props.fieldId === constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA) {
            fieldValue = constants.CARE_CARD_DEMENTIA_CODE_ALZHEIMERS;
          }
        }
        // If updating email field, update entry in user-email-to-uid path
        if (this.props.fieldId === constants.CARE_CARD_FIELD_ID_EMAIL) {
          await db.ref(constants.DB_PATH_USER_EMAIL_TO_UID).update({
            [hash(this.props.initialValue)]: null,
            [hash(fieldValue)]: careRecipientUid,
          });
        }
        await careRecipientRef.update({
          [this.props.fieldId]: fieldValue,
        });
      });
    });
    // Exit edit mode
    this.setState({
      ...this.state,
      editable: false,
    });
  }
  handleClickEdit() {
    // Enter edit mode
    this.setState({
      ...this.state,
      editable: true,
    });
  }

  render() {
    let fieldValue = this.state.value;
    // If edit mode is on, render the form field
    if (this.state.editable) {
      let onChangeFunc = this.handleChange;
      // Use isDateField boolean instead of field ID because this is used by multiple fields
      if (this.props.isDateField) {
        // React Bootstrap Date Picker requires ISO strings, not MM/DD/YYYY strings used by FB
        fieldValue = fieldValue ? utils.usToIsoDate(fieldValue) : '';
        // The onChange callback params for React Bootstrap Date Picker differ from other fields
        onChangeFunc = this.handleChangeDate;
      }
      const saveButtonDisabled = (
        this.props.fieldId === constants.CARE_CARD_FIELD_ID_EMAIL &&
        !utils.isValidEmailEntry(fieldValue)
      );
      // TODO(kai): Add cancel button next to save button
      return (
        <tr>
          <td>{this.props.title}</td>
          <td>{this.props.formFieldGenerator(fieldValue, onChangeFunc)}</td>
          <td>
            <Button bsStyle="primary" disabled={saveButtonDisabled} onClick={this.handleClickSave}>
              {constants.CARE_CARD_BUTTON_TEXT_SAVE}
            </Button>
          </td>
        </tr>
      );
    }
    // Otherwise, render the field value
    if (!fieldValue) {
      fieldValue = <i>Unspecified</i>;
    } else if (this.props.fieldId === constants.CARE_CARD_FIELD_ID_GENDER) {
      fieldValue = utils.genderCodeToName(fieldValue);
    } else if (this.props.fieldId === constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA) {
      fieldValue = utils.dementiaCodeToName(fieldValue);
    }
    return (
      <tr>
        <td>{this.props.title}</td>
        <td className="multiline">{fieldValue}</td>
        <td>
          <Button onClick={this.handleClickEdit}>
            <Glyphicon className="button-icon" glyph="pencil" />
            {constants.CARE_CARD_BUTTON_TEXT_EDIT}
          </Button>
        </td>
      </tr>
    );
  }
}

CareCardEditWrapperComponent.propTypes = {
  fieldId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  initialValue: PropTypes.string.isRequired,
  formFieldGenerator: PropTypes.func.isRequired,
  isDateField: PropTypes.bool,
};

CareCardEditWrapperComponent.defaultProps = {
  isDateField: false,
};

export default CareCardEditWrapperComponent;
