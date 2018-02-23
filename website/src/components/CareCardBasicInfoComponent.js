import PropTypes from 'prop-types';
import React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import DatePicker from 'react-16-bootstrap-date-picker';

import CareCardEditWrapperComponent from './CareCardEditWrapperComponent';
import * as constants from '../static/constants';


// Convenience method from React Bootstrap documentation
const FieldGroup = ({ id, label, ...props }) => (
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl {...props} />
  </FormGroup>
);

FieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const getFirstNameFormField = (fieldValue, onChangeFunc) => (
  <FieldGroup
    id={constants.CARE_CARD_FIELD_ID_FIRST_NAME}
    type="text"
    label={constants.CARE_CARD_FIELD_TITLE_FIRST_NAME}
    value={fieldValue}
    placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_FIRST_NAME}
    onChange={onChangeFunc}
  />
);

const getLastNameFormField = (fieldValue, onChangeFunc) => (
  <FieldGroup
    id={constants.CARE_CARD_FIELD_ID_LAST_NAME}
    type="text"
    label={constants.CARE_CARD_FIELD_TITLE_LAST_NAME}
    value={fieldValue}
    placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_LAST_NAME}
    onChange={onChangeFunc}
  />
);

const getBirthdayFormField = (fieldValue, onChangeFunc) => (
  <FormGroup>
    <ControlLabel>{constants.CARE_CARD_FIELD_TITLE_BIRTHDAY}</ControlLabel>
    <DatePicker
      id={constants.CARE_CARD_FIELD_ID_BIRTHDAY}
      dateFormat={constants.DATE_FORMAT}
      value={fieldValue}
      onChange={onChangeFunc}
    />
  </FormGroup>
);

const getGenderFormField = (fieldValue, onChangeFunc) => (
  <FormGroup controlId={constants.CARE_CARD_FIELD_ID_GENDER}>
    <ControlLabel>{constants.CARE_CARD_FIELD_TITLE_GENDER}</ControlLabel>
    <FormControl
      componentClass="select"
      value={fieldValue}
      placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_GENDER}
      onChange={onChangeFunc}
    >
      <option value={constants.CARE_CARD_GENDER_CODE_FEMALE}>
        {constants.CARE_CARD_GENDER_NAME_FEMALE}
      </option>
      <option value={constants.CARE_CARD_GENDER_CODE_MALE}>
        {constants.CARE_CARD_GENDER_NAME_MALE}
      </option>
    </FormControl>
  </FormGroup>
);

const getEmailFormField = (fieldValue, onChangeFunc) => (
  <FieldGroup
    id={constants.CARE_CARD_FIELD_ID_EMAIL}
    type="text"
    label={constants.CARE_CARD_FIELD_TITLE_EMAIL}
    value={fieldValue}
    placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_EMAIL}
    onChange={onChangeFunc}
  />
);

const getAddressFormField = (fieldValue, onChangeFunc) => (
  <FormGroup controlId={constants.CARE_CARD_FIELD_ID_ADDRESS}>
    <ControlLabel>{constants.CARE_CARD_FIELD_TITLE_ADDRESS}</ControlLabel>
    <FormControl
      componentClass="textarea"
      value={fieldValue}
      placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_ADDRESS}
      onChange={onChangeFunc}
    />
  </FormGroup>
);

const CareCardBasicInfoComponent = props => (
  <div>
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_FIRST_NAME}
      title={constants.CARE_CARD_FIELD_TITLE_FIRST_NAME}
      initialValue={props.firstName}
      formFieldGenerator={getFirstNameFormField}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_LAST_NAME}
      title={constants.CARE_CARD_FIELD_TITLE_LAST_NAME}
      initialValue={props.lastName}
      formFieldGenerator={getLastNameFormField}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_BIRTHDAY}
      title={constants.CARE_CARD_FIELD_TITLE_BIRTHDAY}
      initialValue={props.birthday}
      formFieldGenerator={getBirthdayFormField}
      isDateField
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_GENDER}
      title={constants.CARE_CARD_FIELD_TITLE_GENDER}
      initialValue={props.gender}
      formFieldGenerator={getGenderFormField}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_EMAIL}
      title={constants.CARE_CARD_FIELD_TITLE_EMAIL}
      initialValue={props.email}
      formFieldGenerator={getEmailFormField}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_ADDRESS}
      title={constants.CARE_CARD_FIELD_TITLE_ADDRESS}
      initialValue={props.address}
      formFieldGenerator={getAddressFormField}
    />
  </div>
);

CareCardBasicInfoComponent.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  birthday: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default CareCardBasicInfoComponent;
