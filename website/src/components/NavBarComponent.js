import * as firebase from 'firebase';
import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';


const signOut = () => {
  firebase.auth().signOut();
};

const NavBarComponent = () => (
  <Navbar collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">Lumi</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="/">
          Timeline
        </NavItem>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={1} onClick={signOut}>
          Sign Out
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBarComponent;
