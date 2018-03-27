import React from 'react';

import CareCardEditWrapperContainer from '../containers/CareCardEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


const CareCardCareInfoComponent = () => utils.wrapWithCareCardTable((
  <tbody>
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_NEEDS_AND_PREFERENCES}
      title={constants.CARE_CARD_FIELD_TITLE_NEEDS_AND_PREFERENCES}
      formFieldGenerator={utils.getNeedsAndPreferencesFieldGenerator()}
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_THINGS_THAT_DELIGHT}
      title={constants.CARE_CARD_FIELD_TITLE_THINGS_THAT_DELIGHT}
      formFieldGenerator={utils.getThingsThatDelightFieldGenerator()}
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_PLACES_OF_INTEREST}
      title={constants.CARE_CARD_FIELD_TITLE_PLACES_OF_INTEREST}
      formFieldGenerator={utils.getPlacesOfInterestFieldGenerator()}
    />
  </tbody>
));

export default CareCardCareInfoComponent;
