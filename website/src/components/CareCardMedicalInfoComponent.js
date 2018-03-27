import React from 'react';

import CareCardEditWrapperContainer from '../containers/CareCardEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


const CareCardMedicalInfoComponent = () => utils.wrapWithCareCardTable((
  <tbody>
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_TYPE_OF_DEMENTIA}
      title={constants.CARE_CARD_FIELD_TITLE_TYPE_OF_DEMENTIA}
      formFieldGenerator={utils.getTypeOfDementiaFieldGenerator()}
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_DATE_OF_DIAGNOSIS}
      title={constants.CARE_CARD_FIELD_TITLE_DATE_OF_DIAGNOSIS}
      formFieldGenerator={utils.getDateOfDiagnosisFieldGenerator()}
      isDateField
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_MEDICATIONS}
      title={constants.CARE_CARD_FIELD_TITLE_MEDICATIONS}
      formFieldGenerator={utils.getMedicationsFieldGenerator()}
    />
    <CareCardEditWrapperContainer
      fieldId={constants.CARE_CARD_FIELD_ID_PROVIDERS}
      title={constants.CARE_CARD_FIELD_TITLE_PROVIDERS}
      formFieldGenerator={utils.getProvidersFieldGenerator()}
    />
  </tbody>
));

export default CareCardMedicalInfoComponent;
