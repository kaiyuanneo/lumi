import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';

import * as constants from '../static/constants';


class NavTopComponent extends Component {
  componentDidMount() {
    this.props.getGroupInfo();
  }
  render() {
    // groupInfo is an object with id and name as keys
    const generateSwitchGroupsMenuItem = groupInfo =>
      <MenuItem key={groupInfo.id}>{groupInfo.name}</MenuItem>;
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
              <a href="/">
                <div className="button-text-accent">
                  <b>{constants.NAVBAR_HEADER_TITLE}</b>{this.props.groupNameLabel}
                </div>
              </a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {getSwitchGroupsElement()}
              <NavItem eventKey={constants.PRODUCT_CODE_SIGN_OUT} onClick={this.props.signOut}>
                {constants.NAVBAR_ITEM_SIGN_OUT}
              </NavItem>
            </Nav>
            <Navbar.Text pullRight>
              {this.props.groupIdLabel}
            </Navbar.Text>
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
  getGroupInfo: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
};

NavTopComponent.defaultProps = {
  groupIdLabel: null,
  groupNameLabel: null,
};

export default NavTopComponent;
