import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Tabs } from 'react-bootstrap';

import SummarySelectCareRecipientContainer from '../containers/SummarySelectCareRecipientContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


class SummaryComponent extends Component {
  componentDidMount() {
    this.props.getCareRecipient();
  }

  render() {
    if (!this.props.fetched) {
      return null;
    }
    // Render care recipient selector if this group has no care recipient yet
    if (!this.props.uid) {
      return <SummarySelectCareRecipientContainer />;
    }
    return (
      <Flexbox flexDirection="column">
        <Flexbox flexDirection="column">
          <Flexbox alignSelf="center">
            <Image src={this.props.profilePic} circle responsive />
          </Flexbox>
          <h4>{this.props.firstName} {this.props.lastName}</h4>
        </Flexbox>
        <br />
        <Flexbox flexDirection="column">
          <Flexbox>
            <Tabs
              defaultActiveKey={this.props.infoCategory}
              className="product-tabs"
              id="summary-tabs"
              onSelect={this.props.saveSummaryInfoCategory}
            >
              {utils.getTabComponent(constants.SUMMARY_CATEGORY_CODE_BASIC)}
              {utils.getTabComponent(constants.SUMMARY_CATEGORY_CODE_MEDICAL)}
              {utils.getTabComponent(constants.SUMMARY_CATEGORY_CODE_CARE)}
            </Tabs>
          </Flexbox>
          <br />
          <Flexbox flexDirection="column" alignContent="center">
            {this.props.contentComponent}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  }
}

SummaryComponent.propTypes = {
  // Props computed from Redux state
  infoCategory: PropTypes.string.isRequired,
  fetched: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  profilePic: PropTypes.string.isRequired,
  contentComponent: PropTypes.element.isRequired,
  // Props that call dispatch actions
  getCareRecipient: PropTypes.func.isRequired,
  saveSummaryInfoCategory: PropTypes.func.isRequired,
};

export default SummaryComponent;