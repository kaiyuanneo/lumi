import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';

import App from '../App';


Enzyme.configure({ adapter: new Adapter() });

describe('Test App component', () => {
  beforeAll(() => {
    sinon.stub(firebase, 'auth').returns({
      onAuthStateChanged: sinon.stub(),
    });
  });

  it('Render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(shallow(<App />), div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
