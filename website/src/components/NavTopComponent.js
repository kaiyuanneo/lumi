import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

import * as constants from '../static/constants';


class NavTopComponent extends Component {
  componentDidMount() {
    this.props.getGroupInfo();
  }
  render() {
    return (
      <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/"><b>{constants.NAVBAR_HEADER_TITLE}</b>{this.props.groupNameLabel}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.groupIdLabel}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

NavTopComponent.propTypes = {
  getGroupInfo: PropTypes.func.isRequired,
  groupIdLabel: PropTypes.element,
  groupNameLabel: PropTypes.string,
};

NavTopComponent.defaultProps = {
  groupIdLabel: null,
  groupNameLabel: null,
};

export default NavTopComponent;
