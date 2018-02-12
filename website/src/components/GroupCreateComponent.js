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
    // Create group record in lumi-groups and add user as a member (uid: true)
    const newGroupRef = firebase.database().ref(constants.DB_PATH_LUMI_GROUPS).push({
      name: this.state.groupName,
      members: {
        [firebase.auth().currentUser.uid]: true,
      },
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
        <h2>Create New Group</h2>
        <form>
          <FormGroup
            controlId="formGroupNewGroup"
            validationState={this.state.groupCreateValidationState}
          >
            <ControlLabel>Choose a group name for your new group</ControlLabel>
            <FormControl
              type="text"
              value={this.state.groupName}
              placeholder="New group name"
              onChange={e => this.handleChange(e)}
            />
            <FormControl.Feedback />
            <HelpBlock>
              Lumi will generate a Group ID to share with family and friends on the next page
            </HelpBlock>
          </FormGroup>
          <Button
            block
            bsSize="large"
            bsStyle="primary"
            disabled={this.state.groupCreateValidationState !== 'success'}
            onClick={() => this.createGroup()}
          >
            Create Group
          </Button>
        </form>
      </div>
    );
  }
}

export default GroupCreateComponent;
