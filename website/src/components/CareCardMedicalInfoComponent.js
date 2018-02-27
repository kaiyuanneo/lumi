import PropTypes from 'prop-types';
import React from 'react';

import CareCardEditWrapperComponent from './CareCardEditWrapperComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


const CareCardMedicalInfoComponent = props => utils.wrapWithCareCardTable((
  <tbody>
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA}
      title={constants.CARE_CARD_FIELD_TITLE_TYPE_OF_DEMENTIA}
      initialValue={props.typeOfDementia}
      formFieldGenerator={
        utils.getSelectFieldGenerator(
          constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA,
          constants.CARE_CARD_FIELD_PLACEHOLDER_TYPE_OF_DEMENTIA,
          {
            [constants.CARE_CARD_DEMENTIA_CODE_ALZHEIMERS]:
              constants.CARE_CARD_DEMENTIA_NAME_ALZHEIMERS,
            [constants.CARE_CARD_DEMENTIA_CODE_VASCULAR]:
              constants.CARE_CARD_DEMENTIA_NAME_VASCULAR,
            [constants.CARE_CARD_DEMENTIA_CODE_LEWY]:
              constants.CARE_CARD_DEMENTIA_NAME_LEWY,
            [constants.CARE_CARD_DEMENTIA_CODE_FRONTOTEMPORAL]:
              constants.CARE_CARD_DEMENTIA_NAME_FRONTOTEMPORAL,
            [constants.CARE_CARD_DEMENTIA_CODE_CREUTZFELDT_JAKOB]:
              constants.CARE_CARD_DEMENTIA_NAME_CREUTZFELDT_JAKOB,
            [constants.CARE_CARD_DEMENTIA_CODE_WERNICKE_KORSAKOFF]:
              constants.CARE_CARD_DEMENTIA_NAME_WERNICKE_KORSAKOFF,
            [constants.CARE_CARD_DEMENTIA_CODE_MIXED]:
              constants.CARE_CARD_DEMENTIA_NAME_MIXED,
            [constants.CARE_CARD_DEMENTIA_CODE_OTHER]:
              constants.CARE_CARD_DEMENTIA_NAME_OTHER,
            [constants.CARE_CARD_DEMENTIA_CODE_UNKNOWN]:
              constants.CARE_CARD_DEMENTIA_NAME_UNKNOWN,
          },
        )
      }
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_DATE_OF_DIAGNOSIS}
      title={constants.CARE_CARD_FIELD_TITLE_DATE_OF_DIAGNOSIS}
      initialValue={props.dateOfDiagnosis}
      formFieldGenerator={
        utils.getDateFieldGenerator(constants.CARE_CARD_FIELD_ID_DATE_OF_DIAGNOSIS)}
      isDateField
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_MEDICATIONS}
      title={constants.CARE_CARD_FIELD_TITLE_MEDICATIONS}
      initialValue={props.medications}
      formFieldGenerator={
        utils.getTextAreaFieldGenerator(
          constants.CARE_CARD_FIELD_ID_MEDICATIONS,
          constants.CARE_CARD_FIELD_PLACEHOLDER_MEDICATIONS,
        )
      }
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_PROVIDERS}
      title={constants.CARE_CARD_FIELD_TITLE_PROVIDERS}
      initialValue={props.providers}
      formFieldGenerator={
        utils.getTextAreaFieldGenerator(
          constants.CARE_CARD_FIELD_ID_PROVIDERS,
          constants.CARE_CARD_FIELD_PLACEHOLDER_PROVIDERS,
        )
      }
    />
  </tbody>
));

CareCardMedicalInfoComponent.propTypes = {
  typeOfDementia: PropTypes.string.isRequired,
  dateOfDiagnosis: PropTypes.string.isRequired,
  medications: PropTypes.string.isRequired,
  providers: PropTypes.string.isRequired,
};

export default CareCardMedicalInfoComponent;
