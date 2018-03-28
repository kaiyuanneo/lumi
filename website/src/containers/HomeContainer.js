import * as firebase from 'firebase';
import React from 'react';
import { connect } from 'react-redux';

import CareCardContainer from './CareCardContainer';
import * as actions from '../actions';
import HomeComponent from '../components/HomeComponent';
import TimelineComponent from '../components/TimelineComponent';
import * as constants from '../static/constants';


const mapStateToProps = (state) => {
  // Determine which product to render
  let productComponent;
  const timelineComponent = <TimelineComponent />;
  const careCardContainer = <CareCardContainer />;
  switch (state.home.currentProductCode) {
    case constants.PRODUCT_CODE_TIMELINE:
      productComponent = timelineComponent;
      break;
    case constants.PRODUCT_CODE_CARE_CARD:
      productComponent = careCardContainer;
      break;
    default:
      productComponent = timelineComponent;
  }
  return {
    productComponent,
    isAuthUserInGroup: state.home.isAuthUserInGroup,
    shouldComponentRender: state.home.isAuthUserInGroup !== null,
  };
};

const mapDispatchToProps = dispatch => ({
  getIsAuthUserInGroup: () => {
    const db = firebase.database();
    const authUid = firebase.auth().currentUser.uid;
    const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
    activeGroupRef.on(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
      // If active group not set, auth user does not belong to a group.
      let isAuthUserInGroup = false;
      if (activeGroupSnapshot.val()) {
        // Remove listener once user has activeGroup because there is no way to leave all groups
        activeGroupRef.off();
        isAuthUserInGroup = true;
      }
      dispatch(actions.saveIsAuthUserInGroup(isAuthUserInGroup));
    });
  },
  switchProduct: (eventKey) => {
    // Clicking sign out will trigger this because it is a child of the navbar
    if (eventKey === constants.PRODUCT_CODE_SIGN_OUT) {
      return;
    }
    this.setState({
      ...this.state,
      // Event keys are product codes
      currentProductCode: eventKey,
    });
  },
});

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeComponent);

export default HomeContainer;
