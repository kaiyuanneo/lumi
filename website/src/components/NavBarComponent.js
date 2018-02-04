import * as firebase from 'firebase';
import Flexbox from 'flexbox-react';
import React from 'react';
import { Image, Nav, Navbar, NavItem } from 'react-bootstrap';

import logo from '../static/images/logo.png';


const signOut = () => {
  firebase.auth().signOut();
};

const NavBarComponent = () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Flexbox flexDirection="row" justifyContent="center" alignItems="center">
          <a href="/">
            <Flexbox flexDirection="row" justifyContent="space-around" alignItems="center">
              <Flexbox>
                <Image src={logo} className="navbar-header-image" />
              </Flexbox>
              <Flexbox className="navbar-header-text" >
                Lumi
              </Flexbox>
            </Flexbox>
          </a>
        </Flexbox>
      </Navbar.Brand>
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="/">
          Timeline
        </NavItem>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={2} onClick={signOut}>
          Sign Out
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBarComponent;
