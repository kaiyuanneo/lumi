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
      formFieldGenerator={
        utils.getTextAreaFieldGenerator(
          constants.CARE_CARD_FIELD_ID_NEEDS_AND_PREFERENCES,
          constants.CARE_CARD_FIELD_PLACEHOLDER_NEEDS_AND_PREFERENCES,
        )
      }
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_THINGS_THAT_DELIGHT}
      title={constants.CARE_CARD_FIELD_TITLE_THINGS_THAT_DELIGHT}
      initialValue={props.thingsThatDelight}
      formFieldGenerator={
        utils.getTextAreaFieldGenerator(
          constants.CARE_CARD_FIELD_ID_THINGS_THAT_DELIGHT,
          constants.CARE_CARD_FIELD_PLACEHOLDER_THINGS_THAT_DELIGHT,
        )
      }
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_PLACES_OF_INTEREST}
      title={constants.CARE_CARD_FIELD_TITLE_PLACES_OF_INTEREST}
      initialValue={props.placesOfInterest}
      formFieldGenerator={
        utils.getTextAreaFieldGenerator(
          constants.CARE_CARD_FIELD_ID_PLACES_OF_INTEREST,
          constants.CARE_CARD_FIELD_PLACEHOLDER_PLACES_OF_INTEREST,
        )
      }
    />
  </tbody>
));

CareCardCareInfoComponent.propTypes = {
  needsAndPreferences: PropTypes.string.isRequired,
  thingsThatDelight: PropTypes.string.isRequired,
  placesOfInterest: PropTypes.string.isRequired,
};

export default CareCardCareInfoComponent;
