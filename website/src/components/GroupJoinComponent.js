import * as firebase from 'firebase';
import React, { Component } from 'react';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import * as constants from '../static/constants';
import * as utils from '../utils';


class GroupJoinComponent extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      groupId: '',
      groupJoinValidationState: null,
    };
  }

  async joinGroup() {
    // Add user as a member in group record in lumi-groups (uid: true)
    await firebase.database().ref(constants.DB_PATH_LUMI_GROUPS).update({
      [`${this.state.groupId}/members/${firebase.auth().currentUser.uid}`]: true,
    });

    await utils.addUserToGroup(this.state.groupId);
  }

  handleChange(e) {
    const groupId = e.target.value;

    // If input is empty, turn off validation
    if (groupId === '') {
      this.setState({
        ...this.state,
        groupId,
        groupJoinValidationState: null,
      });
      return;
    }

    // Sync local state with value in form field
    this.setState({
      ...this.state,
      groupId,
    });

    // Validate that input is an existing group ID
    const db = firebase.database();
    const groupRef = db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${groupId}`);
    groupRef.once(constants.DB_EVENT_NAME_VALUE, (groupSnapshot) => {
      // Do not update validation if form field cleared before validation finished
      if (this.state.groupId === '') {
        return;
      }
      this.setState({
        ...this.state,
        groupJoinValidationState: groupSnapshot.val() ? 'success' : 'error',
      });
    });
  }

  render() {
    return (
      <div>
        <h2>Join Existing Group</h2>
        <form>
          <FormGroup
            controlId="formGroupJoinGroup"
            validationState={this.state.groupJoinValidationState}
          >
            <ControlLabel>Join an existing Lumi Group</ControlLabel>
            <FormControl
              type="text"
              value={this.state.groupId}
              placeholder="Lumi Group ID"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            <HelpBlock>This ID must be a valid group ID of an existing Lumi Group</HelpBlock>
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={this.state.groupJoinValidationState !== 'success'}
            onClick={() => this.joinGroup()}
          >
            Join Group
          </Button>
        </form>
      </div>
    );
  }
}

export default GroupJoinComponent;
