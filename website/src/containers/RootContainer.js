import * as firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';
import RootComponent from '../components/RootComponent';


const mapStateToProps = state => ({
  isSignedIn: state.auth.isSignedIn,
});

const mapDispatchToProps = dispatch => ({
  getIsSignedIn: () => firebase.auth().onAuthStateChanged((user) => {
    dispatch(actions.saveIsSignedIn(user !== null));
  }),
});

const RootContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RootComponent);

export default RootContainer;
