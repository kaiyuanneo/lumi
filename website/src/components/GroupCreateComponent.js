import * as firebase from 'firebase';
import React, { Component } from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import * as constants from '../static/constants';
import * as utils from '../utils';


class GroupCreateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      groupCreateValidationState: null,
    };
  }

  async createGroup() {
    // Create group record in lumi-groups and add user to the group
    const newGroupRef = firebase.database().ref(constants.DB_PATH_LUMI_GROUPS).push({
      name: this.state.groupName,
    });
    await utils.addUserToGroup(newGroupRef.key);
  }

  handleChange(e) {
    const groupName = e.target.value;
    this.setState({
      ...this.state,
      groupName,
      groupCreateValidationState: groupName === '' ? 'error' : 'success',
    });
  }

  render() {
    return (
      <div>
        <h2>{constants.GROUP_CREATE_TITLE}</h2>
        <form>
          <FormGroup
            controlId="formGroupNewGroup"
            validationState={this.state.groupCreateValidationState}
          >
            <ControlLabel>{constants.GROUP_NAME_FIELD_PROMPT}</ControlLabel>
            <FormControl
              type="text"
              value={this.state.groupName}
              placeholder={constants.GROUP_NAME_FIELD_PLACEHOLDER}
              onChange={e => this.handleChange(e)}
            />
            <FormControl.Feedback />
            <HelpBlock>{constants.GROUP_NAME_FIELD_HELP}</HelpBlock>
          </FormGroup>
          <Button
            block
            bsSize="large"
            bsStyle="primary"
            disabled={this.state.groupCreateValidationState !== 'success'}
            onClick={() => this.createGroup()}
          >
            {constants.GROUP_CREATE_BUTTON_TEXT}
          </Button>
        </form>
      </div>
    );
  }
}

export default GroupCreateComponent;
