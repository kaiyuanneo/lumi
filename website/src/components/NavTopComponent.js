import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MenuItem, Nav, Navbar, NavDropdown, NavItem, OverlayTrigger, Tooltip } from 'react-bootstrap';

import * as constants from '../static/constants';


class NavTopComponent extends Component {
  componentDidMount() {
    this.props.getGroupInfo();
    // Attach Google Analytics tag to brand link in navbar
    this.props.logTapsBrand();
  }
  render() {
    const copyGroupIdTooltip = (
      <Tooltip id="copy-group-id">
        Click me to copy group ID!
      </Tooltip>
    );
    // groupInfo is an object with id and name as keys
    const generateSwitchGroupsMenuItem = groupInfo => (
      <MenuItem
        // eventKey is necessary for react-bootstrap to identify the clicked item
        eventKey={`${constants.PRODUCT_CODE_SELECT_GROUP}${groupInfo.id}`}
        // key is necessary for React to render lists properly
        key={`${constants.PRODUCT_CODE_SELECT_GROUP}${groupInfo.id}`}
      >
        {groupInfo.name}
      </MenuItem>
    );
    const getSwitchGroupsElement = () => {
      if (this.props.groups.length <= 0) {
        return null;
      }
      return (
        <NavDropdown
          eventKey={constants.PRODUCT_CODE_SWITCH_GROUPS}
          title={constants.NAVBAR_ITEM_SWITCH_GROUPS}
          id="switch-groups-dropdown"
        >
          {this.props.groups.map(generateSwitchGroupsMenuItem)}
          <MenuItem eventKey={constants.PRODUCT_CODE_CREATE_OR_JOIN_GROUP}>
            {constants.NAVBAR_ITEM_CREATE_OR_JOIN_GROUP}
          </MenuItem>
        </NavDropdown>
      );
    };
    return (
      <div className="nav-top">
        <Navbar collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/" id="brand">
                <div className="button-text-accent">
                  <b>{constants.NAVBAR_HEADER_TITLE}</b>{this.props.groupNameLabel}
                </div>
              </a>
            </Navbar.Brand>
            <Navbar.Toggle onClick={this.props.logTapsHamburger} />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight onSelect={this.props.handleNavSelect}>
              <OverlayTrigger
                placement="bottom"
                overlay={copyGroupIdTooltip}
                onClick={this.props.copyGroupId}
              >
                <NavItem
                  eventKey={constants.PRODUCT_CODE_COPY_GROUP_ID}
                  disabled={this.props.disableCopyButton}
                >
                  {this.props.groupIdLabel}
                </NavItem>
              </OverlayTrigger>
              {getSwitchGroupsElement()}
              <NavItem eventKey={constants.PRODUCT_CODE_SIGN_OUT}>
                {constants.NAVBAR_ITEM_SIGN_OUT}
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

NavTopComponent.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  groupIdLabel: PropTypes.string,
  groupNameLabel: PropTypes.string,
  disableCopyButton: PropTypes.bool.isRequired,
  copyGroupId: PropTypes.func.isRequired,
  getGroupInfo: PropTypes.func.isRequired,
  handleNavSelect: PropTypes.func.isRequired,
  logTapsBrand: PropTypes.func.isRequired,
  logTapsHamburger: PropTypes.func.isRequired,
};

NavTopComponent.defaultProps = {
  groupIdLabel: null,
  groupNameLabel: null,
};

export default NavTopComponent;
