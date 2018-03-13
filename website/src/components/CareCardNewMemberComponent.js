import * as firebase from 'firebase';
import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ButtonToolbar, Table } from 'react-bootstrap';
import hash from 'string-hash';

import CareCardNewMemberFormFieldComponent from './CareCardNewMemberFormFieldComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


// TODO(kai): Implement profile pic upload capability
class CareCardNewMemberComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      // Gender is stored in lowercase in the DB
      // Set default gender so that value gets stored if user does not change value in select field
      gender: constants.CARE_CARD_GENDER_CODE_FEMALE,
      // Dates are stored in MM/DD/YYYY format in the DB
      birthday: '',
      email: '',
      address: '',
      // Medical info
      // Set default TOD so that value gets stored if user does not change value in select field
      typeOfDementia: constants.CARE_CARD_DEMENTIA_CODE_ALZHEIMERS,
      dateOfDiagnosis: '',
      medications: '',
      providers: '',
      // Care info
      needsAndPreferences: '',
      thingsThatDelight: '',
      placesOfInterest: '',
    };
  }

  render() {
    const getHandleChangeFunc = fieldId => (e) => {
      this.setState({
        ...this.state,
        [fieldId]: e.target.value,
      });
    };
    const getHandleChangeDateFunc = fieldId => (value, formattedValue) => this.setState({
      ...this.state,
      [fieldId]: formattedValue,
    });
    const saveNewMember = async () => {
      const db = firebase.database();
      // Save new member info in user path as a new user and use an auto-generated key as user ID.
      // If this new member ever signs in, AuthComponent will merge this and the new member data.
      const newMemberRef = await db.ref(constants.DB_PATH_USERS).push({
        ...this.state,
      });
      // Save new member email to user-email-to-uid table so that Lumi can merge this user's
      // profiles by email should this user ever sign in to Lumi.
      await db.ref(constants.DB_PATH_USER_EMAIL_TO_UID).update({
        [hash(this.state.email)]: newMemberRef.key,
      });
      // Add new member to current group and set as active care recipient
      const authUid = firebase.auth().currentUser.uid;
      const activeGroupIdRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
      const activeGroupIdSnapshot = await activeGroupIdRef.once(constants.DB_EVENT_NAME_VALUE);
      const activeGroupId = activeGroupIdSnapshot.val();
      await utils.addUserToGroup(activeGroupId, newMemberRef.key);
      await db.ref(`${constants.DB_PATH_LUMI_GROUPS}/${activeGroupId}`).update({
        activeCareRecipient: newMemberRef.key,
      });
    };
    return (
      <Flexbox flexDirection="column" alignItems="center">
        <h2>{constants.CARE_CARD_CREATE_NEW_MEMBER_PROMPT}</h2>
        <Table>
          <tbody>
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_FIRST_NAME}
              formField={
                utils.getFirstNameFieldGenerator()(
                  this.state.firstName,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_FIRST_NAME),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_LAST_NAME}
              formField={
                utils.getLastNameFieldGenerator()(
                  this.state.lastName,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_LAST_NAME),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_BIRTHDAY}
              formField={
                utils.getBirthdayFieldGenerator()(
                  this.state.birthday ? utils.usToIsoDate(this.state.birthday) : '',
                  getHandleChangeDateFunc(constants.CARE_CARD_FIELD_ID_BIRTHDAY),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_GENDER}
              formField={
                utils.getGenderFieldGenerator()(
                  this.state.gender,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_GENDER),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_EMAIL}
              formField={
                utils.getEmailFieldGenerator()(
                  this.state.email,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_EMAIL),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_ADDRESS}
              formField={
                utils.getAddressFieldGenerator()(
                  this.state.address,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_ADDRESS),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_TYPE_OF_DEMENTIA}
              formField={
                utils.getTypeOfDementiaFieldGenerator()(
                  this.state.typeOfDementia,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_DATE_OF_DIAGNOSIS}
              formField={
                utils.getDateOfDiagnosisFieldGenerator()(
                  this.state.dateOfDiagnosis ? utils.usToIsoDate(this.state.dateOfDiagnosis) : '',
                  getHandleChangeDateFunc(constants.CARE_CARD_FIELD_ID_DATE_OF_DIAGNOSIS),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_MEDICATIONS}
              formField={
                utils.getMedicationsFieldGenerator()(
                  this.state.medications,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_MEDICATIONS),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_PROVIDERS}
              formField={
                utils.getProvidersFieldGenerator()(
                  this.state.providers,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_PROVIDERS),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_NEEDS_AND_PREFERENCES}
              formField={
                utils.getNeedsAndPreferencesFieldGenerator()(
                  this.state.needsAndPreferences,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_NEEDS_AND_PREFERENCES),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_THINGS_THAT_DELIGHT}
              formField={
                utils.getThingsThatDelightFieldGenerator()(
                  this.state.thingsThatDelight,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_THINGS_THAT_DELIGHT),
                )
              }
            />
            <CareCardNewMemberFormFieldComponent
              fieldTitle={constants.CARE_CARD_FIELD_TITLE_PLACES_OF_INTEREST}
              formField={
                utils.getPlacesOfInterestFieldGenerator()(
                  this.state.placesOfInterest,
                  getHandleChangeFunc(constants.CARE_CARD_FIELD_ID_PLACES_OF_INTEREST),
                )
              }
            />
          </tbody>
        </Table>
        <Flexbox>
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              disabled={!utils.isValidEmailEntry(this.state.email)}
              onClick={saveNewMember}
            >
              {constants.BUTTON_TEXT_SAVE}
            </Button>
            <Button onClick={this.props.unmountFunc}>
              {constants.BUTTON_TEXT_CANCEL}
            </Button>
          </ButtonToolbar>
        </Flexbox>
      </Flexbox>
    );
  }
}

CareCardNewMemberComponent.propTypes = {
  unmountFunc: PropTypes.func.isRequired,
};

export default CareCardNewMemberComponent;
