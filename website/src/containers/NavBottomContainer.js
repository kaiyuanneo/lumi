// NB: Private functions are underscore-prefixed and exported for tests
import ReactGA from 'react-ga';
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
      ReactGA.event({
        category: constants.GA_CATEGORY_NAV,
        action: constants.GA_ACTION_TAP_ADD_MOMENT,
      });
      window.location.assign(constants.URL_LUMI_CHAT);
      return;
    }
    // Log taps to Google Analytics
    switch (eventKey) {
      case constants.PRODUCT_CODE_TIMELINE:
        ReactGA.event({
          category: constants.GA_CATEGORY_NAV,
          action: constants.GA_ACTION_TAP_TIMELINE,
        });
        break;
      case constants.PRODUCT_CODE_SUMMARY:
        ReactGA.event({
          category: constants.GA_CATEGORY_NAV,
          action: constants.GA_ACTION_TAP_SUMMARY,
        });
        break;
      case constants.PRODUCT_CODE_CARE_PROFILE:
        ReactGA.event({
          category: constants.GA_CATEGORY_NAV,
          action: constants.GA_ACTION_TAP_CARE_PROFILE,
        });
        break;
      default:
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
