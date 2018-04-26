import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import InfoIcon from 'react-icons/lib/fa/info-circle';
import NewsIcon from 'react-icons/lib/fa/newspaper-o';
import ChatIcon from 'react-icons/lib/md/chat';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import * as constants from '../static/constants';


const NavBottomComponent = props => (
  <Navbar className="nav-bottom" fixedBottom onSelect={props.switchProduct}>
    {/* Not using space-between bc Flexbox btw Nav and NavItem breaks react-bootstrap style */}
    <Flexbox justifyContent="center">
      <Nav activeKey={props.activeKey}>
        <NavItem eventKey={constants.PRODUCT_CODE_TIMELINE}>
          <Flexbox flexDirection="column" alignItems="center">
            <NewsIcon size={constants.NAVBAR_ICON_SIZE} />
            <div className="nav-bottom-text">
              {constants.NAVBAR_ITEM_TIMELINE}
            </div>
          </Flexbox>
        </NavItem>
        <NavItem eventKey={constants.PRODUCT_CODE_CHAT}>
          <Flexbox flexDirection="column" alignItems="center">
            <ChatIcon size={constants.NAVBAR_ICON_SIZE} />
            <div className="nav-bottom-text">
              {constants.NAVBAR_ITEM_CHAT}
            </div>
          </Flexbox>
        </NavItem>
        <NavItem eventKey={constants.PRODUCT_CODE_SUMMARY}>
          <Flexbox flexDirection="column" alignItems="center">
            <InfoIcon size={constants.NAVBAR_ICON_SIZE} />
            <div className="nav-bottom-text">
              {constants.NAVBAR_ITEM_SUMMARY}
            </div>
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
