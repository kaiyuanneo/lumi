import React from 'react';

import CareCardEditWrapperContainer from '../containers/CareCardEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


const CareCardBasicInfoComponent = () => utils.wrapWithCareCardTable((
  <tbody>
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_FIRST_NAME}
      title={constants.CARE_CARD_FIELD_TITLE_FIRST_NAME}
      formFieldGenerator={utils.getFirstNameFieldGenerator()}
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_LAST_NAME}
      title={constants.CARE_CARD_FIELD_TITLE_LAST_NAME}
      formFieldGenerator={utils.getLastNameFieldGenerator()}
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_BIRTHDAY}
      title={constants.CARE_CARD_FIELD_TITLE_BIRTHDAY}
      formFieldGenerator={utils.getBirthdayFieldGenerator()}
      isDateField
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_GENDER}
      title={constants.CARE_CARD_FIELD_TITLE_GENDER}
      formFieldGenerator={utils.getGenderFieldGenerator()}
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_EMAIL}
      title={constants.CARE_CARD_FIELD_TITLE_EMAIL}
      formFieldGenerator={utils.getEmailFieldGenerator()}
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_ADDRESS}
      title={constants.CARE_CARD_FIELD_TITLE_ADDRESS}
      formFieldGenerator={utils.getAddressFieldGenerator()}
    />
  </tbody>
));

export default CareCardBasicInfoComponent;
