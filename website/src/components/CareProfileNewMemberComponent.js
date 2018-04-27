import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, ButtonToolbar, Table } from 'react-bootstrap';

import CareProfileNewMemberFormFieldComponent from './CareProfileNewMemberFormFieldComponent';
import * as constants from '../static/constants';


const CareProfileNewMemberComponent = props => (
  <Flexbox flexDirection="column" alignItems="center">
    <h2>{constants.CARE_PROFILE_CREATE_NEW_MEMBER_PROMPT}</h2>
    <Table>
      <tbody>
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_FIRST_NAME}
          formField={props.firstNameFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_LAST_NAME}
          formField={props.lastNameFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_BIRTHDAY}
          formField={props.birthdayFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_GENDER}
          formField={props.genderFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_EMAIL}
          formField={props.emailFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_ADDRESS}
          formField={props.addressFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_TYPE_OF_DEMENTIA}
          formField={props.typeOfDementiaFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_DATE_OF_DIAGNOSIS}
          formField={props.dateOfDiagnosisFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_MEDICATIONS}
          formField={props.medicationsFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_PROVIDERS}
          formField={props.providersFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_NEEDS_AND_PREFERENCES}
          formField={props.needsAndPreferencesFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_THINGS_THAT_DELIGHT}
          formField={props.thingsThatDelightFormField}
        />
        <CareProfileNewMemberFormFieldComponent
          fieldTitle={constants.CARE_PROFILE_FIELD_TITLE_PLACES_OF_INTEREST}
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

CareProfileNewMemberComponent.propTypes = {
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

export default CareProfileNewMemberComponent;
