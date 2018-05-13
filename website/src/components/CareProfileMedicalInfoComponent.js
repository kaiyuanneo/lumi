import React from 'react';

import CareProfileEditWrapperContainer from '../containers/CareProfileEditWrapperContainer';
import * as constants from '../static/constants';
import * as baseUtils from '../utils/baseUtils';


const CareProfileMedicalInfoComponent = () => baseUtils.wrapWithTable((
  <tbody>
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA}
      title={constants.CARE_PROFILE_FIELD_TITLE_TYPE_OF_DEMENTIA}
      formFieldGenerator={baseUtils.getTypeOfDementiaFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_DATE_OF_DIAGNOSIS}
      title={constants.CARE_PROFILE_FIELD_TITLE_DATE_OF_DIAGNOSIS}
      formFieldGenerator={baseUtils.getDateOfDiagnosisFieldGenerator()}
      isDateField
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_MEDICATIONS}
      title={constants.CARE_PROFILE_FIELD_TITLE_MEDICATIONS}
      formFieldGenerator={baseUtils.getMedicationsFieldGenerator()}
    />
    <CareProfileEditWrapperContainer
      fieldId={constants.CARE_PROFILE_FIELD_ID_PROVIDERS}
      title={constants.CARE_PROFILE_FIELD_TITLE_PROVIDERS}
      formFieldGenerator={baseUtils.getProvidersFieldGenerator()}
    />
  </tbody>
));

export default CareProfileMedicalInfoComponent;
