import React from 'react';

import SummaryEditWrapperContainer from '../containers/SummaryEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


const SummaryMedicalInfoComponent = () => utils.wrapWithSummaryTable((
  <tbody>
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_TYPE_OF_DEMENTIA}
      title={constants.SUMMARY_FIELD_TITLE_TYPE_OF_DEMENTIA}
      formFieldGenerator={utils.getTypeOfDementiaFieldGenerator()}
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_DATE_OF_DIAGNOSIS}
      title={constants.SUMMARY_FIELD_TITLE_DATE_OF_DIAGNOSIS}
      formFieldGenerator={utils.getDateOfDiagnosisFieldGenerator()}
      isDateField
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_MEDICATIONS}
      title={constants.SUMMARY_FIELD_TITLE_MEDICATIONS}
      formFieldGenerator={utils.getMedicationsFieldGenerator()}
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_PROVIDERS}
      title={constants.SUMMARY_FIELD_TITLE_PROVIDERS}
      formFieldGenerator={utils.getProvidersFieldGenerator()}
    />
  </tbody>
));

export default SummaryMedicalInfoComponent;
