import * as firebase from 'firebase';
import React, { Component } from 'react';

import AuthComponent from './components/AuthComponent';
import TimelineComponent from './components/TimelineComponent';
import * as constants from './static/constants';
import logo from './static/images/logo.png';
import './static/styles.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: firebase.auth().currentUser != null,
    };

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ signedIn: true });
      } else {
        this.setState({ signedIn: false });
      }
    });
  }

  render() {
    let body;
    if (this.state.signedIn) {
      body = <TimelineComponent />;
    } else {
      body = <AuthComponent />;
    }

    // Standard template for all Lumi pages
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{constants.WEBSITE_TITLE}</h1>
        </header>
        {body}
        <link rel="stylesheet" href={constants.URL_BOOTSTRAP_CSS} />
      </div>
    );
  }
}

export default App;
