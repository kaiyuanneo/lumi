import PropTypes from 'prop-types';
import React, { Component } from 'react';

import NavBottomContainer from '../containers/NavBottomContainer';
import NavTopContainer from '../containers/NavTopContainer';


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
    return (
      <div className="navbar-offset">
        <NavTopContainer />
        {this.props.productComponent}
        <NavBottomContainer />
      </div>
    );
  }
}

HomeComponent.propTypes = {
  shouldComponentRender: PropTypes.bool.isRequired,
  getIsAuthUserInGroup: PropTypes.func.isRequired,
  saveWindowWidth: PropTypes.func.isRequired,
  productComponent: PropTypes.element.isRequired,
};

export default HomeComponent;
