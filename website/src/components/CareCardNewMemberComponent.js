import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, ButtonToolbar, Table } from 'react-bootstrap';

import CareCardNewMemberFormFieldComponent from './CareCardNewMemberFormFieldComponent';
import * as constants from '../static/constants';


const CareCardNewMemberComponent = props => (
  <Flexbox flexDirection="column" alignItems="center">
    <h2>{constants.CARE_CARD_CREATE_NEW_MEMBER_PROMPT}</h2>
    <Table>
      <tbody>
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_FIRST_NAME}
          formField={props.firstNameFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_LAST_NAME}
          formField={props.lastNameFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_BIRTHDAY}
          formField={props.birthdayFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_GENDER}
          formField={props.genderFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_EMAIL}
          formField={props.emailFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_ADDRESS}
          formField={props.addressFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_TYPE_OF_DEMENTIA}
          formField={props.typeOfDementiaFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_DATE_OF_DIAGNOSIS}
          formField={props.dateOfDiagnosisFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_MEDICATIONS}
          formField={props.medicationsFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_PROVIDERS}
          formField={props.providersFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_NEEDS_AND_PREFERENCES}
          formField={props.needsAndPreferencesFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_THINGS_THAT_DELIGHT}
          formField={props.thingsThatDelightFormField}
        />
        <CareCardNewMemberFormFieldComponent
          fieldTitle={constants.CARE_CARD_FIELD_TITLE_PLACES_OF_INTEREST}
          formField={props.placesOfInterestFormField}
        />
      </tbody>
    </Table>
    <Flexbox>
      <ButtonToolbar>
        <Button
          bsStyle="primary"
          disabled={props.isSaveButtonDisabled}
          onClick={props.saveNewMember}
        >
          {constants.BUTTON_TEXT_SAVE}
        </Button>
        <Button onClick={props.unmountFunc}>
          {constants.BUTTON_TEXT_CANCEL}
        </Button>
      </ButtonToolbar>
    </Flexbox>
  </Flexbox>
);

CareCardNewMemberComponent.propTypes = {
  // Form fields
  firstNameFormField: PropTypes.element.isRequired,
  lastNameFormField: PropTypes.element.isRequired,
  birthdayFormField: PropTypes.element.isRequired,
  genderFormField: PropTypes.element.isRequired,
  emailFormField: PropTypes.element.isRequired,
  addressFormField: PropTypes.element.isRequired,
  typeOfDementiaFormField: PropTypes.element.isRequired,
  dateOfDiagnosisFormField: PropTypes.element.isRequired,
  medicationsFormField: PropTypes.element.isRequired,
  providersFormField: PropTypes.element.isRequired,
  needsAndPreferencesFormField: PropTypes.element.isRequired,
  thingsThatDelightFormField: PropTypes.element.isRequired,
  placesOfInterestFormField: PropTypes.element.isRequired,

  // UI Settings
  isSaveButtonDisabled: PropTypes.bool.isRequired,

  // Save function
  saveNewMember: PropTypes.func.isRequired,
  unmountFunc: PropTypes.func.isRequired,
};

export default CareCardNewMemberComponent;
