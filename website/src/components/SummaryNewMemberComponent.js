import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, ButtonToolbar, Table } from 'react-bootstrap';

import SummaryNewMemberFormFieldComponent from './SummaryNewMemberFormFieldComponent';
import * as constants from '../static/constants';


const SummaryNewMemberComponent = props => (
  <Flexbox flexDirection="column" alignItems="center">
    <h2>{constants.SUMMARY_CREATE_NEW_MEMBER_PROMPT}</h2>
    <Table>
      <tbody>
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_FIRST_NAME}
          formField={props.firstNameFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_LAST_NAME}
          formField={props.lastNameFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_BIRTHDAY}
          formField={props.birthdayFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_GENDER}
          formField={props.genderFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_EMAIL}
          formField={props.emailFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_ADDRESS}
          formField={props.addressFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_TYPE_OF_DEMENTIA}
          formField={props.typeOfDementiaFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_DATE_OF_DIAGNOSIS}
          formField={props.dateOfDiagnosisFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_MEDICATIONS}
          formField={props.medicationsFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_PROVIDERS}
          formField={props.providersFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_NEEDS_AND_PREFERENCES}
          formField={props.needsAndPreferencesFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_THINGS_THAT_DELIGHT}
          formField={props.thingsThatDelightFormField}
        />
        <SummaryNewMemberFormFieldComponent
          fieldTitle={constants.SUMMARY_FIELD_TITLE_PLACES_OF_INTEREST}
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

SummaryNewMemberComponent.propTypes = {
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

export default SummaryNewMemberComponent;
