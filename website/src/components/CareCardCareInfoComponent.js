import PropTypes from 'prop-types';
import React from 'react';
import { FormControl, FormGroup, Table } from 'react-bootstrap';

import CareCardEditWrapperComponent from './CareCardEditWrapperComponent';
import * as constants from '../static/constants';


const getNeedsAndPreferencesFormField = (fieldValue, onChangeFunc) => (
  <FormGroup controlId={constants.CARE_CARD_FIELD_ID_NEEDS_AND_PREFERENCES}>
    <FormControl
      componentClass="textarea"
      value={fieldValue}
      placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_NEEDS_AND_PREFERENCES}
      onChange={onChangeFunc}
    />
  </FormGroup>
);

const getThingsThatDelightFormField = (fieldValue, onChangeFunc) => (
  <FormGroup controlId={constants.CARE_CARD_FIELD_ID_THINGS_THAT_DELIGHT}>
    <FormControl
      componentClass="textarea"
      value={fieldValue}
      placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_THINGS_THAT_DELIGHT}
      onChange={onChangeFunc}
    />
  </FormGroup>
);

const getPlacesOfInterestFormField = (fieldValue, onChangeFunc) => (
  <FormGroup controlId={constants.CARE_CARD_FIELD_ID_PLACES_OF_INTEREST}>
    <FormControl
      componentClass="textarea"
      value={fieldValue}
      placeholder={constants.CARE_CARD_FIELD_PLACEHOLDER_PLACES_OF_INTEREST}
      onChange={onChangeFunc}
    />
  </FormGroup>
);

const CareCardCareInfoComponent = props => (
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
          fieldId={constants.CARE_CARD_FIELD_ID_NEEDS_AND_PREFERENCES}
          title={constants.CARE_CARD_FIELD_TITLE_NEEDS_AND_PREFERENCES}
          initialValue={props.needsAndPreferences}
          formFieldGenerator={getNeedsAndPreferencesFormField}
        />
        <CareCardEditWrapperComponent
          fieldId={constants.CARE_CARD_FIELD_ID_THINGS_THAT_DELIGHT}
          title={constants.CARE_CARD_FIELD_TITLE_THINGS_THAT_DELIGHT}
          initialValue={props.thingsThatDelight}
          formFieldGenerator={getThingsThatDelightFormField}
        />
        <CareCardEditWrapperComponent
          fieldId={constants.CARE_CARD_FIELD_ID_PLACES_OF_INTEREST}
          title={constants.CARE_CARD_FIELD_TITLE_PLACES_OF_INTEREST}
          initialValue={props.placesOfInterest}
          formFieldGenerator={getPlacesOfInterestFormField}
        />
      </tbody>
    </Table>
  </div>
);

CareCardCareInfoComponent.propTypes = {
  needsAndPreferences: PropTypes.string.isRequired,
  thingsThatDelight: PropTypes.string.isRequired,
  placesOfInterest: PropTypes.string.isRequired,
};

export default CareCardCareInfoComponent;
