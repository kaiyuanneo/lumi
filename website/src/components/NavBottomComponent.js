import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';

import * as constants from '../static/constants';


const NavBottomComponent = props => (
  <Navbar fixedBottom onSelect={props.switchProduct}>
    <Nav activeKey={props.activeKey}>
      <NavItem eventKey={constants.PRODUCT_CODE_TIMELINE}>
        <Flexbox flexDirection="column" alignItems="center">
          <Glyphicon glyph="home" />
          {constants.NAVBAR_ITEM_TIMELINE}
        </Flexbox>
      </NavItem>
      <NavItem eventKey={constants.PRODUCT_CODE_CHAT}>
        <Flexbox flexDirection="column" alignItems="center">
          <Glyphicon glyph="plus" />
          {constants.NAVBAR_ITEM_CHAT}
        </Flexbox>
      </NavItem>
      <NavItem eventKey={constants.PRODUCT_CODE_CARE_CARD}>
        <Flexbox flexDirection="column" alignItems="center">
          <Glyphicon glyph="info-sign" />
          {constants.NAVBAR_ITEM_CARE_CARD}
        </Flexbox>
      </NavItem>
      <NavItem eventKey={constants.PRODUCT_CODE_SIGN_OUT} onClick={props.signOut}>
        <Flexbox flexDirection="column" alignItems="center">
          <Glyphicon glyph="log-out" />
          {constants.NAVBAR_ITEM_SIGN_OUT}
        </Flexbox>
      </NavItem>
    </Nav>
  </Navbar>
);

NavBottomComponent.propTypes = {
  activeKey: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired,
  switchProduct: PropTypes.func.isRequired,
};

export default NavBottomComponent;
