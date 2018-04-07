// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import React from 'react';
import { connect } from 'react-redux';

import CareCardContainer from './CareCardContainer';
import TimelineContainer from './TimelineContainer';
import * as actions from '../actions';
import HomeComponent from '../components/HomeComponent';
import * as constants from '../static/constants';


const mapStateToProps = (state) => {
  // Determine which product to render
  let productComponent;
  const timelineContainer = <TimelineContainer />;
  const careCardContainer = <CareCardContainer />;
  switch (state.home.currentProductCode) {
    case constants.PRODUCT_CODE_TIMELINE:
      productComponent = timelineContainer;
      break;
    case constants.PRODUCT_CODE_CARE_CARD:
      productComponent = careCardContainer;
      break;
    default:
      productComponent = timelineContainer;
  }
  return {
    productComponent,
    isAuthUserInGroup: state.home.isAuthUserInGroup,
    shouldComponentRender: state.home.isAuthUserInGroup !== null,
  };
};


export const _saveIsAuthUserInGroup = (dispatch, activeGroupRef, activeGroupSnapshot) => {
  // If active group not set, auth user does not belong to a group.
  let isAuthUserInGroup = false;
  if (activeGroupSnapshot.val()) {
    // Remove listener once user has activeGroup because there is no way to leave all groups
    activeGroupRef.off();
    isAuthUserInGroup = true;
  }
  dispatch(actions.saveIsAuthUserInGroup(isAuthUserInGroup));
};


export const _getIsAuthUserInGroup = (dispatch) => {
  const db = firebase.database();
  const authUid = firebase.auth().currentUser.uid;
  const activeGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUid}/activeGroup`);
  activeGroupRef.on(constants.DB_EVENT_NAME_VALUE, (activeGroupSnapshot) => {
    _saveIsAuthUserInGroup(dispatch, activeGroupRef, activeGroupSnapshot);
  });
};


const mapDispatchToProps = dispatch => ({
  getIsAuthUserInGroup: () => _getIsAuthUserInGroup(dispatch),
});

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeComponent);

export default HomeContainer;
