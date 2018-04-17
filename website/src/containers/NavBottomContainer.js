// NB: Private functions are underscore-prefixed and exported for tests
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
    // Event keys are product codes
    dispatch(actions.saveCurrentProductCode(eventKey));
  },
});


const NavBottomContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBottomComponent);

export default NavBottomContainer;
