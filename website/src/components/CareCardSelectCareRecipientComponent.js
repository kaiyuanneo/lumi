import * as firebase from 'firebase';
import Flexbox from 'flexbox-react';
import React, { Component } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';

import CareCardNewMemberComponent from './CareCardNewMemberComponent';
import * as constants from '../static/constants';


class CareCardSelectCareRecipientComponent extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickSelect = this.handleClickSelect.bind(this);
    this.state = {
      members: new Map(),
      selectedMember: '',
      userClickedSelect: false,
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
    // Record that user clicked select so that Lumi can control when React should re-render
    this.setState({
      ...this.state,
      userClickedSelect: true,
    });

    // React will manage next steps if user chooses to create a New Member
    if (this.state.selectedMember === constants.CARE_CARD_CARE_RECIPIENT_CODE_NEW_MEMBER) {
      return;
    }

    // Set active care recipient of current group to be the selected member
    const db = firebase.database();
    const authUid = firebase.auth().currentUser.uid;
    const activeGroupIdRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
    activeGroupIdRef.once(constants.DB_EVENT_NAME_VALUE, (activeGroupIdSnapshot) => {
      db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupIdSnapshot.val()}`).update({
        activeCareRecipient: this.state.selectedMember,
      });
    });
  }

  render() {
    if (
      this.state.selectedMember === constants.CARE_CARD_CARE_RECIPIENT_CODE_NEW_MEMBER &&
      // Do not render new member form until user clicks Select
      this.state.userClickedSelect
    ) {
      // Pass an unmount function so that user can return to this page from the new member page
      const unmountFunc = () => this.setState({
        ...this.state,
        userClickedSelect: false,
        selectedMember: '',
      });
      return <CareCardNewMemberComponent unmountFunc={unmountFunc} />;
    }

    const userList = Array.from(this.state.members.keys()).map(memberId => (
      <option key={memberId} value={memberId}>
        {this.state.members.get(memberId)}
      </option>
    ));
    // Include New Member option in select menu
    userList.push((
      <option
        key={constants.CARE_CARD_CARE_RECIPIENT_CODE_NEW_MEMBER}
        value={constants.CARE_CARD_CARE_RECIPIENT_CODE_NEW_MEMBER}
      >
        {constants.CARE_CARD_CARE_RECIPIENT_NAME_NEW_MEMBER}
      </option>
    ));
    return (
      <Flexbox flexDirection="column">
        <h2>{constants.CARE_CARD_NEW_CARE_RECIPIENT_PROMPT}</h2>
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
          {constants.BUTTON_TEXT_SELECT}
        </Button>
      </Flexbox>
    );
  }
}

export default CareCardSelectCareRecipientComponent;
