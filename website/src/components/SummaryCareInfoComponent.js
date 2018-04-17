import React from 'react';

import SummaryEditWrapperContainer from '../containers/SummaryEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


const SummaryCareInfoComponent = () => utils.wrapWithSummaryTable((
  <tbody>
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_NEEDS_AND_PREFERENCES}
      title={constants.SUMMARY_FIELD_TITLE_NEEDS_AND_PREFERENCES}
      formFieldGenerator={utils.getNeedsAndPreferencesFieldGenerator()}
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_THINGS_THAT_DELIGHT}
      title={constants.SUMMARY_FIELD_TITLE_THINGS_THAT_DELIGHT}
      formFieldGenerator={utils.getThingsThatDelightFieldGenerator()}
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_PLACES_OF_INTEREST}
      title={constants.SUMMARY_FIELD_TITLE_PLACES_OF_INTEREST}
      formFieldGenerator={utils.getPlacesOfInterestFieldGenerator()}
    />
  </tbody>
));

export default SummaryCareInfoComponent;
