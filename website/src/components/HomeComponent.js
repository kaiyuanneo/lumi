import * as firebase from 'firebase';
import React, { Component } from 'react';

import CareCardComponent from './CareCardComponent';
import NavBarComponent from './NavBarComponent';
import NewUserComponent from './NewUserComponent';
import TimelineComponent from './TimelineComponent';
import * as constants from '../static/constants';


class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthUserInGroup: null,
      currentProductCode: constants.PRODUCT_CODE_TIMELINE,
    };
  }

  componentDidMount() {
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
      this.setState({
        ...this.state,
        isAuthUserInGroup,
      });
    });
  }

  render() {
    // Do not render anything before we know if auth user is in a group
    const { isAuthUserInGroup } = this.state;
    if (isAuthUserInGroup === null) {
      return null;
    }
    // Pass this function to NavbarComponent to switch between products from navbar
    const switchProduct = (eventKey) => {
      // Clicking sign out will trigger this because it is a child of the navbar
      if (eventKey === constants.PRODUCT_CODE_SIGN_OUT) {
        return;
      }
      this.setState({
        ...this.state,
        // Event keys are product codes
        currentProductCode: eventKey,
      });
    };
    // Determine which product o
    const getProductComponent = () => {
      const timelineComponent = <TimelineComponent />;
      const careCardComponent = <CareCardComponent />;
      switch (this.state.currentProductCode) {
        case constants.PRODUCT_CODE_TIMELINE:
          return timelineComponent;
        case constants.PRODUCT_CODE_CARE_CARD:
          return careCardComponent;
        default:
          return timelineComponent;
      }
    };
    const contentComponent = isAuthUserInGroup ? getProductComponent() : <NewUserComponent />;
    return (
      <div className="navbar-offset">
        <NavBarComponent switchProduct={switchProduct} />
        {contentComponent}
      </div>
    );
  }
}

export default HomeComponent;
