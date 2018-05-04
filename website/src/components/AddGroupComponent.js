import PropTypes from 'prop-types';
import React, { Component } from 'react';

import GroupCreateContainer from '../containers/GroupCreateContainer';
import GroupJoinContainer from '../containers/GroupJoinContainer';
import * as constants from '../static/constants';


class NewUserComponent extends Component {
  componentDidMount() {
    this.props.getUserFirstName();
  }
  render() {
    return (
      <div>
        <h1>{`${constants.NEW_USER_PAGE_TITLE}${this.props.firstName}!`}</h1>
        {constants.NEW_USER_PAGE_SUBTITLE}
        <GroupCreateContainer />
        <br />
        Or
        <br />
        <GroupJoinContainer />
      </div>
    );
  }
}

NewUserComponent.propTypes = {
  firstName: PropTypes.string.isRequired,
  getUserFirstName: PropTypes.func.isRequired,
};

export default NewUserComponent;
