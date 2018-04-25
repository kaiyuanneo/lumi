import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';

import * as constants from '../static/constants';


const NavBottomComponent = props => (
  <Navbar className="nav-bottom" fixedBottom onSelect={props.switchProduct}>
    {/* Not using space-between bc Flexbox btw Nav and NavItem breaks react-bootstrap style */}
    <Flexbox justifyContent="center">
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
        <NavItem eventKey={constants.PRODUCT_CODE_SUMMARY}>
          <Flexbox flexDirection="column" alignItems="center">
            <Glyphicon glyph="info-sign" />
            {constants.NAVBAR_ITEM_SUMMARY}
          </Flexbox>
        </NavItem>
      </Nav>
    </Flexbox>
  </Navbar>
);

NavBottomComponent.propTypes = {
  activeKey: PropTypes.string.isRequired,
  switchProduct: PropTypes.func.isRequired,
};

export default NavBottomComponent;
