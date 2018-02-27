import PropTypes from 'prop-types';
import React from 'react';

import CareCardEditWrapperComponent from './CareCardEditWrapperComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


const CareCardBasicInfoComponent = props => utils.wrapWithCareCardTable((
  <tbody>
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_FIRST_NAME}
      title={constants.CARE_CARD_FIELD_TITLE_FIRST_NAME}
      initialValue={props.firstName}
      formFieldGenerator={
        utils.getTextFieldGenerator(
          constants.CARE_CARD_FIELD_ID_FIRST_NAME,
          constants.CARE_CARD_FIELD_PLACEHOLDER_FIRST_NAME,
        )
      }
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_LAST_NAME}
      title={constants.CARE_CARD_FIELD_TITLE_LAST_NAME}
      initialValue={props.lastName}
      formFieldGenerator={
        utils.getTextFieldGenerator(
          constants.CARE_CARD_FIELD_ID_LAST_NAME,
          constants.CARE_CARD_FIELD_PLACEHOLDER_LAST_NAME,
        )
      }
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_BIRTHDAY}
      title={constants.CARE_CARD_FIELD_TITLE_BIRTHDAY}
      initialValue={props.birthday}
      formFieldGenerator={utils.getDateFieldGenerator(constants.CARE_CARD_FIELD_ID_BIRTHDAY)}
      isDateField
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_GENDER}
      title={constants.CARE_CARD_FIELD_TITLE_GENDER}
      initialValue={props.gender}
      formFieldGenerator={
        utils.getSelectFieldGenerator(
          constants.CARE_CARD_FIELD_ID_GENDER,
          constants.CARE_CARD_FIELD_PLACEHOLDER_GENDER,
          {
            [constants.CARE_CARD_GENDER_CODE_FEMALE]: constants.CARE_CARD_GENDER_NAME_FEMALE,
            [constants.CARE_CARD_GENDER_CODE_MALE]: constants.CARE_CARD_GENDER_NAME_MALE,
          },
        )
      }
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_EMAIL}
      title={constants.CARE_CARD_FIELD_TITLE_EMAIL}
      initialValue={props.email}
      formFieldGenerator={
        utils.getTextFieldGenerator(
          constants.CARE_CARD_FIELD_ID_EMAIL,
          constants.CARE_CARD_FIELD_PLACEHOLDER_EMAIL,
        )
      }
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_ADDRESS}
      title={constants.CARE_CARD_FIELD_TITLE_ADDRESS}
      initialValue={props.address}
      formFieldGenerator={
        utils.getTextAreaFieldGenerator(
          constants.CARE_CARD_FIELD_ID_ADDRESS,
          constants.CARE_CARD_FIELD_PLACEHOLDER_ADDRESS,
        )
      }
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
