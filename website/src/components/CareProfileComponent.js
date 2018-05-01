import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Panel, PanelGroup, Table } from 'react-bootstrap';

import CareProfileBasicInfoComponent from '../components/CareProfileBasicInfoComponent';
import CareProfileMedicalInfoComponent from '../components/CareProfileMedicalInfoComponent';
import CareProfileCareInfoComponent from '../components/CareProfileCareInfoComponent';
import CareProfileSelectCareRecipientContainer from '../containers/CareProfileSelectCareRecipientContainer';


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
          <h4>{this.props.fullName}&#39;s Care Profile</h4>
        </Flexbox>
        <br />
        <Flexbox flexDirection="column" alignContent="center">
          <PanelGroup accordion id="care-profile">
            <Panel eventKey="1">
              <Panel.Heading>
                <Panel.Title toggle>Basic Info</Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <Table bordered>
                  <CareProfileBasicInfoComponent />
                </Table>
              </Panel.Body>
            </Panel>
            <Panel eventKey="2">
              <Panel.Heading>
                <Panel.Title toggle>Medical Info</Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <Table bordered>
                  <CareProfileMedicalInfoComponent />
                </Table>
              </Panel.Body>
            </Panel>
            <Panel eventKey="3">
              <Panel.Heading>
                <Panel.Title toggle>Care Info</Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <Table bordered>
                  <CareProfileCareInfoComponent />
                </Table>
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
  fullName: PropTypes.string.isRequired,
  profilePic: PropTypes.string.isRequired,
  // Props that call dispatch actions
  getCareRecipient: PropTypes.func.isRequired,
};

export default CareProfileComponent;
