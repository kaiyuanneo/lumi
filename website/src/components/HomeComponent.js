import PropTypes from 'prop-types';
import React, { Component } from 'react';

import NavBottomContainer from '../containers/NavBottomContainer';
import NavTopContainer from '../containers/NavTopContainer';
import NewUserContainer from '../containers/NewUserContainer';


class HomeComponent extends Component {
  componentDidMount() {
    this.props.getIsAuthUserInGroup();
  }
  render() {
    // Do not render anything before we know if auth user is in a group
    if (!this.props.shouldComponentRender) {
      return null;
    }
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
  productComponent: PropTypes.element.isRequired,
};

HomeComponent.defaultProps = {
  isAuthUserInGroup: null,
};

export default HomeComponent;
