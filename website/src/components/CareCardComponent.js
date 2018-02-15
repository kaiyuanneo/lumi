import * as firebase from 'firebase';
import Flexbox from 'flexbox-react';
import React, { Component } from 'react';
import { Image, Tabs } from 'react-bootstrap';

import CareCardBasicInfoComponent from './CareCardBasicInfoComponent';
import CareCardMedicalInfoComponent from './CareCardMedicalInfoComponent';
import CareCardCareInfoComponent from './CareCardCareInfoComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';

class CareCardComponent extends Component {
  constructor(props) {
    super(props);

    // There may be more fields than these stored in local state, but these are the ones we need
    this.state = {
      infoCategory: constants.CARE_CARD_CATEGORY_CODE_BASIC,
      // Basic info
      uid: null,
      firstName: '',
      lastName: '',
      // Gender is stored in lowercase in the DB
      gender: '',
      // Birthday is stored in MM/DD/YYYY format in the DB
      birthday: '',
      profilePic: '',
      email: '',
      address: '',
      // Medical info
      typeOfDementia: '',
      dateOfDiagnosis: '',
      medications: '',
      providers: '',
      // Care info
      needsAndPreferences: '',
      thingsThatDelight: '',
      placesOfInterest: '',
    };

    const db = firebase.database();
    const authUid = firebase.auth().currentUser.uid;
    const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
    activeGroupRef.once(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
      // activeCareRecipient field in DB stores the UID of the currently active care recipient
      const careRecipientUidRef =
        db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupSnapshot.val()}/activeCareRecipient`);
      careRecipientUidRef.on(constants.DB_EVENT_NAME_VALUE, (careRecipientUidSnapshot) => {
        const careRecipientUid = careRecipientUidSnapshot.val();
        if (!careRecipientUid) {
          return;
        }
        careRecipientUidRef.off();
        // Listen for changes in the active care recipient record and update state accordingly
        // TODO(kai): Remember to turn off this listener when we change care recipients
        const careRecipientRef = db.ref(`${constants.DB_PATH_USERS}/${careRecipientUid}`);
        careRecipientRef.on(constants.DB_EVENT_NAME_VALUE, (careRecipientSnapshot) => {
          this.setState({
            ...this.state,
            // Copy all fields to local state for brevity, even though we don't need all of them
            ...careRecipientSnapshot.val(),
          });
        });
      });
    });
  }

  // TODO(kai): Render new user flow if there is no care recipient yet (see notebook)
  render() {
    const switchInfo = (category) => {
      this.setState({
        ...this.state,
        infoCategory: category,
      });
    };
    const getContentComponent = () => {
      switch (this.state.infoCategory) {
        case constants.CARE_CARD_CATEGORY_CODE_BASIC:
          return (
            <CareCardBasicInfoComponent
              firstName={this.state.firstName}
              lastName={this.state.lastName}
              gender={this.state.gender}
              birthday={this.state.birthday}
              email={this.state.email}
              address={this.state.address}
            />
          );
        case constants.CARE_CARD_CATEGORY_CODE_MEDICAL:
          return <CareCardMedicalInfoComponent />;
        case constants.CARE_CARD_CATEGORY_CODE_CARE:
          return <CareCardCareInfoComponent />;
        default:
          return <CareCardBasicInfoComponent />;
      }
    };
    return (
      <div>
        <Flexbox>
          <Image src={this.state.profilePic} circle responsive />
          {this.state.firstName} {this.state.lastName}
          <Tabs
            defaultActiveKey={constants.CARE_CARD_CATEGORY_CODE_BASIC}
            className="product-tabs"
            id="care-card-tabs"
            onSelect={switchInfo}
          >
            {utils.getTabComponent(constants.CARE_CARD_CATEGORY_CODE_BASIC)}
            {utils.getTabComponent(constants.CARE_CARD_CATEGORY_CODE_MEDICAL)}
            {utils.getTabComponent(constants.CARE_CARD_CATEGORY_CODE_CARE)}
          </Tabs>
        </Flexbox>
        {getContentComponent()}
      </div>
    );
  }
}

export default CareCardComponent;
