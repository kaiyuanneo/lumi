import PropTypes from 'prop-types';
import React, { Component } from 'react';

import NavBottomContainer from '../containers/NavBottomContainer';
import NavTopContainer from '../containers/NavTopContainer';
import NewUserContainer from '../containers/NewUserContainer';


class HomeComponent extends Component {
  componentDidMount() {
    this.props.getIsAuthUserInGroup();
    window.addEventListener('resize', this.props.saveWindowWidth);
  }
  render() {
    // Do not render anything before we know if auth user is in a group
    if (!this.props.shouldComponentRender) {
      return null;
    }
    // TODO(kai): Move this logic into HomeContainer so that NewUserContainer can be
    // toggled as a product when user wishes to join multiple groups
    const contentComponent = this.props.isAuthUserInGroup ?
      this.props.productComponent : <NewUserContainer />;
    return (
      <div className="navbar-offset">
        <NavTopContainer />
        {contentComponent}
        <NavBottomContainer />
      </div>
    );
  }
}

HomeComponent.propTypes = {
  isAuthUserInGroup: PropTypes.bool,
  shouldComponentRender: PropTypes.bool.isRequired,
  getIsAuthUserInGroup: PropTypes.func.isRequired,
  saveWindowWidth: PropTypes.func.isRequired,
  productComponent: PropTypes.element.isRequired,
};

HomeComponent.defaultProps = {
  isAuthUserInGroup: null,
};

export default HomeComponent;
