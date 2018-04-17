// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';
import NavBottomComponent from '../components/NavBottomComponent';
import * as constants from '../static/constants';


const mapStateToProps = state => ({
  activeKey: state.home.currentProductCode,
});


const mapDispatchToProps = dispatch => ({
  switchProduct: (eventKey) => {
    // Clicking Chat will open Messenger
    if (eventKey === constants.PRODUCT_CODE_CHAT) {
      window.location.assign('https://urlgeni.us/fb_messenger/lumi');
      return;
    }
    // Clicking sign out will trigger this because it is a child of the navbar
    if (eventKey === constants.PRODUCT_CODE_SIGN_OUT) {
      return;
    }
    // Event keys are product codes
    dispatch(actions.saveCurrentProductCode(eventKey));
  },
});


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  signOut: () => firebase.auth().signOut(),
});


const NavBottomContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(NavBottomComponent);

export default NavBottomContainer;
