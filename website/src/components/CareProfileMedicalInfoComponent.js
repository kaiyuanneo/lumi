import React from 'react';

import CareProfileEditWrapperContainer from '../containers/CareProfileEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


const CareProfileMedicalInfoComponent = () => utils.wrapWithCareProfileTable((
  <tbody>
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA}
      title={constants.CARE_PROFILE_FIELD_TITLE_TYPE_OF_DEMENTIA}
      formFieldGenerator={utils.getTypeOfDementiaFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_DATE_OF_DIAGNOSIS}
      title={constants.CARE_PROFILE_FIELD_TITLE_DATE_OF_DIAGNOSIS}
      formFieldGenerator={utils.getDateOfDiagnosisFieldGenerator()}
      isDateField
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_MEDICATIONS}
      title={constants.CARE_PROFILE_FIELD_TITLE_MEDICATIONS}
      formFieldGenerator={utils.getMedicationsFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_PROVIDERS}
      title={constants.CARE_PROFILE_FIELD_TITLE_PROVIDERS}
      formFieldGenerator={utils.getProvidersFieldGenerator()}
    />
  </tbody>
));

export default CareProfileMedicalInfoComponent;
