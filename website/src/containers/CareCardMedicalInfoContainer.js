import { connect } from 'react-redux';

import CareCardMedicalInfoComponent from '../components/CareCardMedicalInfoComponent';


const mapStateToProps = state => ({
  typeOfDementia: state.careCard.typeOfDementia,
  dateOfDiagnosis: state.careCard.dateOfDiagnosis,
  medications: state.careCard.medications,
  providers: state.careCard.providers,
});

const CareCardMedicalInfoContainer = connect(
  mapStateToProps,
  null,
  null,
)(CareCardMedicalInfoComponent);

export default CareCardMedicalInfoContainer;
