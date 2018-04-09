import PropTypes from 'prop-types';
import React from 'react';
import { FirebaseAuth } from 'react-firebaseui';

import * as constants from '../static/constants';
import lumiLogo from '../static/images/logo.png';


const AuthComponent = props => (
  <div>
    <header className="App-header">
      <img src={lumiLogo} className="App-logo" alt="logo" />
      <h1 className="App-title">{constants.WEBSITE_TITLE}</h1>
    </header>
    <FirebaseAuth uiConfig={props.uiConfig} firebaseAuth={props.firebaseAuth()} />
  </div>
);

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
