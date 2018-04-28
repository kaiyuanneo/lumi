import PropTypes from 'prop-types';
import React, { Component } from 'react';

import * as constants from '../static/constants';


class SummaryComponent extends Component {
  componentDidMount() {
    this.props.syncMessages();
  }
  render() {
    return (
      <div>
        <h4>{this.props.groupName} Group Summary</h4>
        <br />
        {this.props.numMessages} moments
        <br />
        {this.props.filterStats[constants.TIMELINE_CATEGORY_CODE_STAR]} starred moments
        <br />
        {this.props.filterStats[constants.TIMELINE_CATEGORY_CODE_ACTIVITY]} activity moments
        <br />
        {this.props.filterStats[constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]} behaviour moments
        <br />
        {this.props.filterStats[constants.TIMELINE_CATEGORY_CODE_MOOD]} mood moments
        <br />
        {this.props.filterStats[constants.TIMELINE_CATEGORY_CODE_MEMORY]} memory moments
        <br />
        {this.props.filterStats[constants.TIMELINE_CATEGORY_CODE_MEDICAL]} medical moments
        <br />
        {this.props.filterStats[constants.TIMELINE_CATEGORY_CODE_CAREGIVER]} caregiver moments
        <br />
        {this.props.filterStats[constants.TIMELINE_CATEGORY_CODE_OTHER]} other moments
        <br />
      </div>
    );
  }
}

SummaryComponent.propTypes = {
  groupName: PropTypes.string.isRequired,
  numMessages: PropTypes.number.isRequired,
  filterStats: PropTypes.shape({
    [constants.TIMELINE_CATEGORY_CODE_STAR]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_ACTIVITY]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_MOOD]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_MEMORY]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_MEDICAL]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_CAREGIVER]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_OTHER]: PropTypes.number,
  }).isRequired,
  syncMessages: PropTypes.func.isRequired,
};

export default SummaryComponent;
