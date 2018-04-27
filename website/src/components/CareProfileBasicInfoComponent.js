import React from 'react';

import CareProfileEditWrapperContainer from '../containers/CareProfileEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


const CareProfileBasicInfoComponent = () => (
  <tbody>
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_FIRST_NAME}
      title={constants.CARE_PROFILE_FIELD_TITLE_FIRST_NAME}
      formFieldGenerator={utils.getFirstNameFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_LAST_NAME}
      title={constants.CARE_PROFILE_FIELD_TITLE_LAST_NAME}
      formFieldGenerator={utils.getLastNameFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_BIRTHDAY}
      title={constants.CARE_PROFILE_FIELD_TITLE_BIRTHDAY}
      formFieldGenerator={utils.getBirthdayFieldGenerator()}
      isDateField
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_GENDER}
      title={constants.CARE_PROFILE_FIELD_TITLE_GENDER}
      formFieldGenerator={utils.getGenderFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_EMAIL}
      title={constants.CARE_PROFILE_FIELD_TITLE_EMAIL}
      formFieldGenerator={utils.getEmailFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_ADDRESS}
      title={constants.CARE_PROFILE_FIELD_TITLE_ADDRESS}
      formFieldGenerator={utils.getAddressFieldGenerator()}
    />
  </tbody>
);

export default CareProfileBasicInfoComponent;
