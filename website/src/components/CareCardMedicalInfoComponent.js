import PropTypes from 'prop-types';
import React from 'react';
import { FormControl, FormGroup, Table } from 'react-bootstrap';
import DatePicker from 'react-16-bootstrap-date-picker';

import CareCardEditWrapperComponent from './CareCardEditWrapperComponent';
import * as constants from '../static/constants';


const getTypeOfDementiaFormField = (fieldValue, onChangeFunc) => (
  <FormGroup controlId={constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA}>
    <FormControl
      componentClass="select"
      value={fieldValue}
      placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_TYPE_OF_DEMENTIA}
      onChange={onChangeFunc}
    >
      <option value={constants.CARE_CARD_DEMENTIA_CODE_ALZHEIMERS}>
        {constants.CARE_CARD_DEMENTIA_NAME_ALZHEIMERS}
      </option>
      <option value={constants.CARE_CARD_DEMENTIA_CODE_VASCULAR}>
        {constants.CARE_CARD_DEMENTIA_NAME_VASCULAR}
      </option>
      <option value={constants.CARE_CARD_DEMENTIA_CODE_LEWY}>
        {constants.CARE_CARD_DEMENTIA_NAME_LEWY}
      </option>
      <option value={constants.CARE_CARD_DEMENTIA_CODE_FRONTOTEMPORAL}>
        {constants.CARE_CARD_DEMENTIA_NAME_FRONTOTEMPORAL}
      </option>
      <option value={constants.CARE_CARD_DEMENTIA_CODE_CREUTZFELDT_JAKOB}>
        {constants.CARE_CARD_DEMENTIA_NAME_CREUTZFELDT_JAKOB}
      </option>
      <option value={constants.CARE_CARD_DEMENTIA_CODE_WERNICKE_KORSAKOFF}>
        {constants.CARE_CARD_DEMENTIA_NAME_WERNICKE_KORSAKOFF}
      </option>
      <option value={constants.CARE_CARD_DEMENTIA_CODE_MIXED}>
        {constants.CARE_CARD_DEMENTIA_NAME_MIXED}
      </option>
      <option value={constants.CARE_CARD_DEMENTIA_CODE_OTHER}>
        {constants.CARE_CARD_DEMENTIA_NAME_OTHER}
      </option>
      <option value={constants.CARE_CARD_DEMENTIA_CODE_UNKNOWN}>
        {constants.CARE_CARD_DEMENTIA_NAME_UNKNOWN}
      </option>
    </FormControl>
  </FormGroup>
);

const getDateOfDiagnosisFormField = (fieldValue, onChangeFunc) => (
  <FormGroup controlId={constants.CARE_CARD_FIELD_ID_DATE_OF_DIAGNOSIS}>
    <DatePicker
      id={constants.CARE_CARD_FIELD_ID_DATE_OF_DIAGNOSIS}
      dateFormat={constants.DATE_FORMAT}
      value={fieldValue}
      onChange={onChangeFunc}
    />
  </FormGroup>
);

const getMedicationsFormField = (fieldValue, onChangeFunc) => (
  <FormGroup controlId={constants.CARE_CARD_FIELD_ID_MEDICATIONS}>
    <FormControl
      componentClass="textarea"
      value={fieldValue}
      placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_MEDICATIONS}
      onChange={onChangeFunc}
    />
  </FormGroup>
);

const getProvidersFormField = (fieldValue, onChangeFunc) => (
  <FormGroup controlId={constants.CARE_CARD_FIELD_ID_PROVIDERS}>
    <FormControl
      componentClass="textarea"
      value={fieldValue}
      placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_PROVIDERS}
      onChange={onChangeFunc}
    />
  </FormGroup>
);

const CareCardMedicalInfoComponent = props => (
  <div>
    <Table bordered hover>
      <thead>
        <tr>
          <th className="product-table-header">{constants.CARE_CARD_TABLE_HEADER_FIELD}</th>
          <th className="product-table-header">{constants.CARE_CARD_TABLE_HEADER_VALUE}</th>
          <th className="product-table-header">{constants.CARE_CARD_TABLE_HEADER_OPTIONS}</th>
        </tr>
      </thead>
      <tbody>
        <CareCardEditWrapperComponent
          fieldId={constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA}
          title={constants.CARE_CARD_FIELD_TITLE_TYPE_OF_DEMENTIA}
          initialValue={props.typeOfDementia}
          formFieldGenerator={getTypeOfDementiaFormField}
        />
        <CareCardEditWrapperComponent
          fieldId={constants.CARE_CARD_FIELD_ID_DATE_OF_DIAGNOSIS}
          title={constants.CARE_CARD_FIELD_TITLE_DATE_OF_DIAGNOSIS}
          initialValue={props.dateOfDiagnosis}
          formFieldGenerator={getDateOfDiagnosisFormField}
          isDateField
        />
        <CareCardEditWrapperComponent
          fieldId={constants.CARE_CARD_FIELD_ID_MEDICATIONS}
          title={constants.CARE_CARD_FIELD_TITLE_MEDICATIONS}
          initialValue={props.medications}
          formFieldGenerator={getMedicationsFormField}
        />
        <CareCardEditWrapperComponent
          fieldId={constants.CARE_CARD_FIELD_ID_PROVIDERS}
          title={constants.CARE_CARD_FIELD_TITLE_PROVIDERS}
          initialValue={props.providers}
          formFieldGenerator={getProvidersFormField}
        />
      </tbody>
    </Table>
  </div>
);

CareCardMedicalInfoComponent.propTypes = {
  typeOfDementia: PropTypes.string.isRequired,
  dateOfDiagnosis: PropTypes.string.isRequired,
  medications: PropTypes.string.isRequired,
  providers: PropTypes.string.isRequired,
};

export default CareCardMedicalInfoComponent;
