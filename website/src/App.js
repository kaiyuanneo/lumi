import * as firebase from 'firebase';
import React, { Component } from 'react';

import AuthComponent from './components/AuthComponent';
import BootstrapStyleComponent from './components/BootstrapStyleComponent';
import HomeComponent from './components/HomeComponent';


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
    return (
      <div className="App">
        {this.state.signedIn ? <HomeComponent /> : <AuthComponent />}
        <BootstrapStyleComponent />
      </div>
    );
  }
}

export default App;
