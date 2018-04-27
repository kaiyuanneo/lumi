import React from 'react';

import CareProfileEditWrapperContainer from '../containers/CareProfileEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


const CareProfileCareInfoComponent = () => (
  <tbody>
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_NEEDS_AND_PREFERENCES}
      title={constants.CARE_PROFILE_FIELD_TITLE_NEEDS_AND_PREFERENCES}
      formFieldGenerator={utils.getNeedsAndPreferencesFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_THINGS_THAT_DELIGHT}
      title={constants.CARE_PROFILE_FIELD_TITLE_THINGS_THAT_DELIGHT}
      formFieldGenerator={utils.getThingsThatDelightFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_PLACES_OF_INTEREST}
      title={constants.CARE_PROFILE_FIELD_TITLE_PLACES_OF_INTEREST}
      formFieldGenerator={utils.getPlacesOfInterestFieldGenerator()}
    />
  </tbody>
);

export default CareProfileCareInfoComponent;
