import PropTypes from 'prop-types';
import React from 'react';

import CareCardEditWrapperComponent from './CareCardEditWrapperComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


// TODO(kai): Implement email validation
const CareCardBasicInfoComponent = props => utils.wrapWithCareCardTable((
  <tbody>
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_FIRST_NAME}
      title={constants.CARE_CARD_FIELD_TITLE_FIRST_NAME}
      initialValue={props.firstName}
      formFieldGenerator={utils.getFirstNameFieldGenerator()}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_LAST_NAME}
      title={constants.CARE_CARD_FIELD_TITLE_LAST_NAME}
      initialValue={props.lastName}
      formFieldGenerator={utils.getLastNameFieldGenerator()}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_BIRTHDAY}
      title={constants.CARE_CARD_FIELD_TITLE_BIRTHDAY}
      initialValue={props.birthday}
      formFieldGenerator={utils.getBirthdayFieldGenerator()}
      isDateField
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_GENDER}
      title={constants.CARE_CARD_FIELD_TITLE_GENDER}
      initialValue={props.gender}
      formFieldGenerator={utils.getGenderFieldGenerator()}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_EMAIL}
      title={constants.CARE_CARD_FIELD_TITLE_EMAIL}
      initialValue={props.email}
      formFieldGenerator={utils.getEmailFieldGenerator()}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_ADDRESS}
      title={constants.CARE_CARD_FIELD_TITLE_ADDRESS}
      initialValue={props.address}
      formFieldGenerator={utils.getAddressFieldGenerator()}
    />
  </tbody>
));

CareCardBasicInfoComponent.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  birthday: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default CareCardBasicInfoComponent;
