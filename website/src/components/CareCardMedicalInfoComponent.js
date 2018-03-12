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
      formFieldGenerator={utils.getTypeOfDementiaFieldGenerator()}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_DATE_OF_DIAGNOSIS}
      title={constants.CARE_CARD_FIELD_TITLE_DATE_OF_DIAGNOSIS}
      initialValue={props.dateOfDiagnosis}
      formFieldGenerator={utils.getDateOfDiagnosisFieldGenerator()}
      isDateField
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_MEDICATIONS}
      title={constants.CARE_CARD_FIELD_TITLE_MEDICATIONS}
      initialValue={props.medications}
      formFieldGenerator={utils.getMedicationsFieldGenerator()}
    />
    <CareCardEditWrapperComponent
      fieldId={constants.CARE_CARD_FIELD_ID_PROVIDERS}
      title={constants.CARE_CARD_FIELD_TITLE_PROVIDERS}
      initialValue={props.providers}
      formFieldGenerator={utils.getProvidersFieldGenerator()}
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
