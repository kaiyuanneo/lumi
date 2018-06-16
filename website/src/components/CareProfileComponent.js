import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Panel, PanelGroup } from 'react-bootstrap';
import DropDownIcon from 'react-icons/lib/md/arrow-drop-down';

import CareProfileInfoBasicContainer from '../containers/CareProfileInfoBasicContainer';
import CareProfileInfoMedicalContainer from '../containers/CareProfileInfoMedicalContainer';
import CareProfileInfoCareContainer from '../containers/CareProfileInfoCareContainer';
import CareProfileSelectCareRecipientContainer from '../containers/CareProfileSelectCareRecipientContainer';
import * as constants from '../static/constants';


class CareProfileComponent extends Component {
  componentDidMount() {
    this.props.getCareRecipient();
  }

  render() {
    if (!this.props.fetched) {
      return null;
    }
    // Render care recipient selector if this group has no care recipient yet
    if (!this.props.uid) {
      return <CareProfileSelectCareRecipientContainer />;
    }
    return (
      <Flexbox flexDirection="column">
        <Flexbox flexDirection="column">
          <Flexbox alignSelf="center">
            <Image src={this.props.profilePic} circle responsive />
          </Flexbox>
          <h4>Care Profile</h4>
        </Flexbox>
        <br />
        <Flexbox flexDirection="column" alignContent="center">
          <PanelGroup accordion id="care-profile">
            <Panel eventKey="1">
              <Panel.Heading>
                <Panel.Title toggle>
                  Basic Info
                  <DropDownIcon size={constants.CARE_PROFILE_ICON_SIZE} />
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <CareProfileInfoBasicContainer />
              </Panel.Body>
            </Panel>
            <Panel eventKey="2">
              <Panel.Heading>
                <Panel.Title toggle>
                  Medical Info
                  <DropDownIcon size={constants.CARE_PROFILE_ICON_SIZE} />
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <CareProfileInfoMedicalContainer />
              </Panel.Body>
            </Panel>
            <Panel eventKey="3">
              <Panel.Heading>
                <Panel.Title toggle>
                  Care Info
                  <DropDownIcon size={constants.CARE_PROFILE_ICON_SIZE} />
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <CareProfileInfoCareContainer />
              </Panel.Body>
            </Panel>
          </PanelGroup>
        </Flexbox>
      </Flexbox>
    );
  }
}

CareProfileComponent.propTypes = {
  // Props computed from Redux state
  fetched: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,
  profilePic: PropTypes.string.isRequired,
  // Props that call dispatch actions
  getCareRecipient: PropTypes.func.isRequired,
};

export default CareProfileComponent;
