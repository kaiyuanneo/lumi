import * as firebase from 'firebase';
import React, { Component } from 'react';

import AuthComponent from './components/AuthComponent';
import BootstrapStyleComponent from './components/BootstrapStyleComponent';
import HomeComponent from './components/HomeComponent';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: null,
    };

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        ...this.state,
        signedIn: user !== null,
      });
    });
  }

  render() {
    // Do not render anything before we know if user is signed in
    const { signedIn } = this.state;
    if (signedIn === null) {
      return null;
    }
    return (
      <div className="App">
        {signedIn ? <HomeComponent /> : <AuthComponent />}
        <BootstrapStyleComponent />
      </div>
    );
  }
}

export default App;
