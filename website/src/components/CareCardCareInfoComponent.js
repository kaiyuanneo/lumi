import PropTypes from 'prop-types';
import React from 'react';

import CareCardEditWrapperComponent from './CareCardEditWrapperComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


const CareCardCareInfoComponent = props => utils.wrapWithCareCardTable((
  <tbody>
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_NEEDS_AND_PREFERENCES}
      title={constants.CARE_CARD_FIELD_TITLE_NEEDS_AND_PREFERENCES}
      initialValue={props.needsAndPreferences}
      formFieldGenerator={utils.getNeedsAndPreferencesFieldGenerator()}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_THINGS_THAT_DELIGHT}
      title={constants.CARE_CARD_FIELD_TITLE_THINGS_THAT_DELIGHT}
      initialValue={props.thingsThatDelight}
      formFieldGenerator={utils.getThingsThatDelightFieldGenerator()}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_PLACES_OF_INTEREST}
      title={constants.CARE_CARD_FIELD_TITLE_PLACES_OF_INTEREST}
      initialValue={props.placesOfInterest}
      formFieldGenerator={utils.getPlacesOfInterestFieldGenerator()}
    />
  </tbody>
));

CareCardCareInfoComponent.propTypes = {
  needsAndPreferences: PropTypes.string.isRequired,
  thingsThatDelight: PropTypes.string.isRequired,
  placesOfInterest: PropTypes.string.isRequired,
};

export default CareCardCareInfoComponent;
