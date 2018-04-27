import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import AddIcon from 'react-icons/lib/md/add';
import HomeIcon from 'react-icons/lib/md/home';
import PersonIcon from 'react-icons/lib/md/person';
import ListIcon from 'react-icons/lib/md/view-list';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import * as constants from '../static/constants';


const NavBottomComponent = props => (
  <Navbar className="nav-bottom" fixedBottom onSelect={props.switchProduct}>
    {/* Not using space-between bc Flexbox btw Nav and NavItem breaks react-bootstrap style */}
    <Flexbox justifyContent="center">
      <Nav activeKey={props.activeKey}>
        <NavItem eventKey={constants.PRODUCT_CODE_TIMELINE} className="nav-bottom-item">
          <Flexbox flexDirection="column" alignItems="center">
            <HomeIcon size={constants.NAVBAR_ICON_SIZE} />
            <div className="nav-bottom-text">
              {constants.NAVBAR_ITEM_TIMELINE}
            </div>
          </Flexbox>
        </NavItem>
        <NavItem eventKey={constants.PRODUCT_CODE_CHAT} className="nav-bottom-item">
          <Flexbox flexDirection="column" alignItems="center">
            <AddIcon size={constants.NAVBAR_ICON_SIZE} />
            <div className="nav-bottom-text">
              {constants.NAVBAR_ITEM_ADD_MEMORY}
            </div>
          </Flexbox>
        </NavItem>
        <NavItem eventKey={constants.PRODUCT_CODE_SUMMARY} className="nav-bottom-item">
          <Flexbox flexDirection="column" alignItems="center">
            <ListIcon size={constants.NAVBAR_ICON_SIZE} />
            <div className="nav-bottom-text">
              {constants.NAVBAR_ITEM_SUMMARY}
            </div>
          </Flexbox>
        </NavItem>
        <NavItem eventKey={constants.PRODUCT_CODE_CARE_PROFILE} className="nav-bottom-item">
          <Flexbox flexDirection="column" alignItems="center">
            <PersonIcon size={constants.NAVBAR_ICON_SIZE} />
            <div className="nav-bottom-text">
              {constants.NAVBAR_ITEM_CARE_PROFILE}
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
