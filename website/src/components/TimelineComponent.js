import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Glyphicon, Image, Table } from 'react-bootstrap';

import TimelineFiltersContainer from '../containers/TimelineFiltersContainer';
import * as constants from '../static/constants';


class TimelineComponent extends Component {
  componentDidMount() {
    this.props.syncMessages();
  }
  render() {
    const messageToTableRow = ([messageKey, messageValue]) => {
      if (!this.props.shouldRenderMessage(messageValue)) {
        return null;
      }
      let messageContent;
      if ('attachments' in messageValue) {
        messageContent = (
          <Flexbox flexDirection="column">
            <Image
              className="timeline-image"
              src={messageValue.attachments[0].payload.url}
              responsive
            />
            {messageValue.text}
          </Flexbox>
        );
      } else {
        messageContent = messageValue.text;
      }
      const starIcon = messageValue.starred ? <Glyphicon glyph="star" /> : null;
      return (
        <tr key={messageKey}>
          <td>{starIcon}</td>
          <td>{this.props.getLocalDateString(messageValue.timestamp)}</td>
          <td>{messageValue.senderFirstName} {messageValue.senderLastName}</td>
          <td>{this.props.getCategoryName(messageValue.category)}</td>
          <td>{messageContent}</td>
        </tr>
      );
    };
    return (
      <div>
        <TimelineFiltersContainer />
        <Table bordered condensed hover>
          <thead>
            <tr>
              <th className="product-table-header">{constants.TIMELINE_TABLE_HEADER_STAR}</th>
              <th className="product-table-header">{constants.TIMELINE_TABLE_HEADER_TIME}</th>
              <th className="product-table-header">{constants.TIMELINE_TABLE_HEADER_USER}</th>
              <th className="product-table-header">{constants.TIMELINE_TABLE_HEADER_CATEGORY}</th>
              <th className="product-table-header">{constants.TIMELINE_TABLE_HEADER_NOTE}</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(this.props.sortedMessages, messageToTableRow)}
          </tbody>
        </Table>
      </div>
    );
  }
}

TimelineComponent.propTypes = {
  sortedMessages: PropTypes.instanceOf(Map).isRequired,
  syncMessages: PropTypes.func.isRequired,
  shouldRenderMessage: PropTypes.func.isRequired,
  getLocalDateString: PropTypes.func.isRequired,
  getCategoryName: PropTypes.func.isRequired,
};

export default TimelineComponent;
