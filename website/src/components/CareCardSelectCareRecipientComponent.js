import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';

import CareCardNewMemberContainer from '../containers/CareCardNewMemberContainer';
import * as constants from '../static/constants';


class CareCardSelectCareRecipientComponent extends Component {
  componentDidMount() {
    this.props.fetchGroupMembers();
  }

  render() {
    if (this.props.shouldRenderNewMemberForm) {
      return <CareCardNewMemberContainer />;
    }
    return (
      <Flexbox flexDirection="column">
        <h2>{constants.CARE_CARD_NEW_CARE_RECIPIENT_PROMPT}</h2>
        <FormGroup controlId={constants.CARE_CARD_FIELD_ID_USER_LIST}>
          <FormControl
            componentClass="select"
            value={this.props.selectedMember}
            placeholder="Select a care recipient"
            onChange={this.props.updateSelectedMember}
          >
            {this.props.memberList}
          </FormControl>
        </FormGroup>
        <Button
          bsStyle="primary"
          disabled={this.props.isSelectButtonDisabled}
          onClick={this.props.handleClickSelect}
        >
          {constants.BUTTON_TEXT_SELECT}
        </Button>
      </Flexbox>
    );
  }
}

CareCardSelectCareRecipientComponent.propTypes = {
  memberList: PropTypes.arrayOf(PropTypes.element).isRequired,
  selectedMember: PropTypes.string.isRequired,
  shouldRenderNewMemberForm: PropTypes.bool.isRequired,
  isSelectButtonDisabled: PropTypes.bool.isRequired,
  updateSelectedMember: PropTypes.func.isRequired,
  fetchGroupMembers: PropTypes.func.isRequired,
  handleClickSelect: PropTypes.func.isRequired,
};

export default CareCardSelectCareRecipientComponent;
