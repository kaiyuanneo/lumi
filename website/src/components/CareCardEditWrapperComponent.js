import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import * as constants from '../static/constants';
import * as utils from '../utils';


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
        await careRecipientRef.update({
          [this.props.fieldId]: this.state.value,
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
    // If edit mode is on, render the form field
    if (this.state.editable) {
      let fieldValue = this.state.value;
      let onChangeFunc = this.handleChange;
      // Use isDateField boolean instead of field ID because this is used by multiple fields
      if (this.props.isDateField) {
        // React Bootstrap Date Picker requires ISO strings, not MM/DD/YYYY strings used by FB
        fieldValue = fieldValue ? utils.usToIsoDate(fieldValue) : '';
        // The onChange callback params for React Bootstrap Date Picker differ from other fields
        onChangeFunc = this.handleChangeDate;
      }
      return (
        <div>
          {this.props.formFieldGenerator(fieldValue, onChangeFunc)}
          <Button
            bsStyle="primary"
            onClick={this.handleClickSave}
          >
            {constants.CARE_CARD_BUTTON_TEXT_SAVE}
          </Button>
        </div>
      );
    }
    // Otherwise, render the field value
    let content = this.state.value;
    if (!content) {
      content = <i>Unspecified</i>;
    } else if (this.props.fieldId === constants.CARE_CARD_FIELD_ID_GENDER) {
      content = utils.genderCodeToName(content);
    }
    return (
      <div>
        <h5>{this.props.title}</h5>
        {content}
        <Button
          onClick={this.handleClickEdit}
        >
          <Glyphicon glyph="pencil" />
          {constants.CARE_CARD_BUTTON_TEXT_EDIT}
        </Button>
      </div>
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
