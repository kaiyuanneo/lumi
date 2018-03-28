import PropTypes from 'prop-types';
import React, { Component } from 'react';

import BootstrapStyleComponent from './BootstrapStyleComponent';
import AuthContainer from '../containers/AuthContainer';
import HomeContainer from '../containers/HomeContainer';


class RootComponent extends Component {
  componentDidMount() {
    this.props.getIsSignedIn();
  }
  render() {
    // Do not render anything before we know if user is signed in
    if (this.props.isSignedIn === null) {
      return null;
    }
    return (
      <div className="App">
        {this.props.isSignedIn ? <HomeContainer /> : <AuthContainer />}
        <BootstrapStyleComponent />
      </div>
    );
  }
}

RootComponent.propTypes = {
  isSignedIn: PropTypes.bool,
  getIsSignedIn: PropTypes.func.isRequired,
};

RootComponent.defaultProps = {
  isSignedIn: null,
};

export default RootComponent;
