import PropTypes from 'prop-types';
import React, { Component } from 'react';


class GroupAddComponent extends Component {
  componentDidMount() {
    this.props.getUserFirstName();
  }
  render() {
    if (!this.props.firstName) {
      return null;
    }
    return (
      <div className="app-padding">
        <h1>
          Welcome to <span className="purple">Lumi</span>,<br />
          {`${this.props.firstName}!`}
        </h1>
        {this.props.groupAddFormContainer}
      </div>
    );
  }
}

GroupAddComponent.propTypes = {
  firstName: PropTypes.string.isRequired,
  groupAddFormContainer: PropTypes.element.isRequired,
  getUserFirstName: PropTypes.func.isRequired,
};

export default GroupAddComponent;
