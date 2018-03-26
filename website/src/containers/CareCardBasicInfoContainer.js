import { connect } from 'react-redux';

import CareCardBasicInfoComponent from '../components/CareCardBasicInfoComponent';


const mapStateToProps = state => ({
  firstName: state.careCard.firstName,
  lastName: state.careCard.lastName,
  gender: state.careCard.gender,
  birthday: state.careCard.birthday,
  email: state.careCard.email,
  address: state.careCard.address,
});

const CareCardBasicInfoContainer = connect(
  mapStateToProps,
  null,
  null,
)(CareCardBasicInfoComponent);

export default CareCardBasicInfoContainer;
