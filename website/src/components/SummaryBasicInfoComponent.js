import React from 'react';

import SummaryEditWrapperContainer from '../containers/SummaryEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


const SummaryBasicInfoComponent = () => utils.wrapWithSummaryTable((
  <tbody>
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_FIRST_NAME}
      title={constants.SUMMARY_FIELD_TITLE_FIRST_NAME}
      formFieldGenerator={utils.getFirstNameFieldGenerator()}
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_LAST_NAME}
      title={constants.SUMMARY_FIELD_TITLE_LAST_NAME}
      formFieldGenerator={utils.getLastNameFieldGenerator()}
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_BIRTHDAY}
      title={constants.SUMMARY_FIELD_TITLE_BIRTHDAY}
      formFieldGenerator={utils.getBirthdayFieldGenerator()}
      isDateField
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_GENDER}
      title={constants.SUMMARY_FIELD_TITLE_GENDER}
      formFieldGenerator={utils.getGenderFieldGenerator()}
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_EMAIL}
      title={constants.SUMMARY_FIELD_TITLE_EMAIL}
      formFieldGenerator={utils.getEmailFieldGenerator()}
    />
    <SummaryEditWrapperContainer
      fieldId={constants.SUMMARY_FIELD_ID_ADDRESS}
      title={constants.SUMMARY_FIELD_TITLE_ADDRESS}
      formFieldGenerator={utils.getAddressFieldGenerator()}
    />
  </tbody>
));

export default SummaryBasicInfoComponent;
