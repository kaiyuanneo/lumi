import * as firebase from 'firebase';
import Flexbox from 'flexbox-react';
import React, { Component } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';

import * as constants from '../static/constants';


class CareCardSelectCareRecipientComponent extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickSelect = this.handleClickSelect.bind(this);
    this.state = {
      members: new Map(),
      selectedMember: '',
    };
  }

  componentDidMount() {
    // Get group member info from DB
    const db = firebase.database();
    const authUid = firebase.auth().currentUser.uid;
    const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
    activeGroupRef.once(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
      const memberIdsRef =
        db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupSnapshot.val()}/members`);
      memberIdsRef.once(constants.DB_EVENT_NAME_VALUE, (memberIdsSnapshot) => {
        const members = new Map();
        let memberIndex = 0;
        memberIdsSnapshot.forEach((memberIdSnapshot) => {
          const memberId = memberIdSnapshot.key;
          const memberRef = db.ref(`${constants.DB_PATH_USERS}/${memberId}`);
          memberRef.once(constants.DB_EVENT_NAME_VALUE, (memberSnapshot) => {
            const member = memberSnapshot.val();
            members.set(memberId, `${member.firstName} ${member.lastName}`);
            // Ensure that the first member's value is saved to DB when user presses Select
            // even when user has not changed the value in the drop down menu
            let { selectedMember } = this.state;
            if (memberIndex === 0) {
              selectedMember = memberId;
            }
            // Trigger re-render after data fetched
            this.setState({
              ...this.state,
              members,
              selectedMember,
            });
            memberIndex += 1;
          });
        });
      });
    });
  }

  handleChange(e) {
    this.setState({
      ...this.state,
      selectedMember: e.target.value,
    });
  }

  handleClickSelect() {
    const db = firebase.database();
    const authUid = firebase.auth().currentUser.uid;
    const activeGroupIdRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
    activeGroupIdRef.once(constants.DB_EVENT_NAME_VALUE, (activeGroupIdSnapshot) => {
      db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupIdSnapshot.val()}`).update({
        activeCareRecipient: this.state.selectedMember,
      });
    });
  }

  // TODO(kai): Include New User button in drop down
  // TODO(kai): Create form for New User functionality that adds new user record into DB
  render() {
    const userList = Array.from(this.state.members.keys()).map(memberId => (
      <option key={memberId} value={memberId}>
        {this.state.members.get(memberId)}
      </option>
    ));
    return (
      <Flexbox flexDirection="column">
        <FormGroup controlId={constants.CARE_CARD_FIELD_ID_USER_LIST}>
          <FormControl
            componentClass="select"
            value={this.state.selectedMember}
            placeholder="Select a care recipient"
            onChange={this.handleChange}
          >
            {userList}
          </FormControl>
        </FormGroup>

        <Button bsStyle="primary" onClick={this.handleClickSelect}>
          {constants.CARE_CARD_BUTTON_TEXT_SELECT}
        </Button>
      </Flexbox>
    );
  }
}

export default CareCardSelectCareRecipientComponent;
