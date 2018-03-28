import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import * as constants from '../static/constants';


class NavBarComponent extends Component {
  componentDidMount() {
    this.props.getGroupInfo();
  }
  render() {
    return (
      <Navbar collapseOnSelect fixedTop onSelect={this.props.switchProduct}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/"><b>{constants.NAVBAR_HEADER_TITLE}</b>{this.props.groupNameLabel}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={constants.PRODUCT_CODE_TIMELINE}>
              {constants.NAVBAR_ITEM_TIMELINE}
            </NavItem>
            <NavItem eventKey={constants.PRODUCT_CODE_CARE_CARD}>
              {constants.NAVBAR_ITEM_CARE_CARD}
            </NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem
              eventKey={constants.PRODUCT_CODE_SIGN_OUT}
              onClick={this.props.signOut}
            >
              {constants.NAVBAR_ITEM_SIGN_OUT}
            </NavItem>
          </Nav>
          {this.props.groupIdLabel}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

NavBarComponent.propTypes = {
  getGroupInfo: PropTypes.func.isRequired,
  switchProduct: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  groupIdLabel: PropTypes.element,
  groupNameLabel: PropTypes.string,
};

NavBarComponent.defaultProps = {
  groupIdLabel: null,
  groupNameLabel: null,
};

export default NavBarComponent;
