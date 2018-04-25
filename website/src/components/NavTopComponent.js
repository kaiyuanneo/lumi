import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import * as constants from '../static/constants';


class NavTopComponent extends Component {
  componentDidMount() {
    this.props.getGroupInfo();
  }
  render() {
    return (
      <div className="nav-top">
        <Navbar collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/"><b>{constants.NAVBAR_HEADER_TITLE}</b>{this.props.groupNameLabel}</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
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
  getGroupInfo: PropTypes.func.isRequired,
  groupIdLabel: PropTypes.string,
  groupNameLabel: PropTypes.string,
  signOut: PropTypes.func.isRequired,
};

NavTopComponent.defaultProps = {
  groupIdLabel: null,
  groupNameLabel: null,
};

export default NavTopComponent;
