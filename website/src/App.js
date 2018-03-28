import * as firebase from 'firebase';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AuthContainer from './containers/AuthContainer';
import BootstrapStyleComponent from './components/BootstrapStyleComponent';
import HomeContainer from './containers/HomeContainer';
import rootReducer from './reducers';


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
      <Provider store={createStore(rootReducer)}>
        <div className="App">
          {signedIn ? <HomeContainer /> : <AuthContainer />}
          <BootstrapStyleComponent />
        </div>
      </Provider>
    );
  }
}

export default App;
