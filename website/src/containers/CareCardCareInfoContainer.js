import { connect } from 'react-redux';

import CareCardCareInfoComponent from '../components/CareCardCareInfoComponent';


const mapStateToProps = state => ({
  needsAndPreferences: state.careCard.needsAndPreferences,
  thingsThatDelight: state.careCard.thingsThatDelight,
  placesOfInterest: state.careCard.placesOfInterest,
});

const CareCardCareInfoContainer = connect(
  mapStateToProps,
  null,
  null,
)(CareCardCareInfoComponent);

export default CareCardCareInfoContainer;
