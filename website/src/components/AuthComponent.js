import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import ReactGA from 'react-ga';

import * as constants from '../static/constants';
import lumiLogo from '../static/images/logo.png';


class AuthComponent extends Component {
  componentDidMount() {
    document.getElementById('sign-in').addEventListener('click', () => {
      ReactGA.event({
        category: constants.GA_CATEGORY_NAV,
        action: constants.GA_ACTION_TAP_SIGN_IN,
      });
    });
  }

  render() {
    return (
      <div>
        <header className="App-header">
          <img src={lumiLogo} className="App-logo" alt="logo" />
          <h1 className="App-title">{constants.WEBSITE_TITLE}</h1>
        </header>
        <div id="sign-in">
          <FirebaseAuth uiConfig={this.props.uiConfig} firebaseAuth={this.props.firebaseAuth()} />
        </div>
      </div>
    );
  }
}

AuthComponent.propTypes = {
  firebaseAuth: PropTypes.func.isRequired,
  uiConfig: PropTypes.shape({
    callbacks: PropTypes.shape({
      signInSuccess: PropTypes.func,
    }),
    signInFlow: PropTypes.string,
    signInOptions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};


export default AuthComponent;
