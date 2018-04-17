import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Glyphicon, Image, Table } from 'react-bootstrap';

import TimelineFiltersContainer from '../containers/TimelineFiltersContainer';


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
          // Need alignItems to prevent image stretching
          <Flexbox flexDirection="column" alignItems="flex-start">
            <div>{messageValue.text}</div>
            <Image
              src={messageValue.attachments[0].payload.url}
              responsive
            />
          </Flexbox>
        );
      } else {
        messageContent = <div>{messageValue.text}</div>;
      }
      const senderFullName = `${messageValue.senderFirstName} ${messageValue.senderLastName}`;
      const messageTimestamp = this.props.getLocalDateString(messageValue.timestamp);
      const messageCategory = this.props.getCategoryName(messageValue.category);
      const starIcon = messageValue.starred ? <div>&nbsp;• <Glyphicon glyph="star" /></div> : null;
      return (
        <tr key={messageKey}>
          <td>
            <Flexbox flexDirection="column" alignItems="flex-start">
              <Flexbox alignItems="center">
                <Image
                  className="timeline-card-profile-image"
                  src={messageValue.senderProfilePic}
                  circle
                />
                <span className="space-horizontal" />
                <Flexbox flexDirection="column">
                  <div>{senderFullName} • {messageTimestamp}</div>
                  <Flexbox><div>{messageCategory}</div>{starIcon}</Flexbox>
                </Flexbox>
              </Flexbox>
              <br />
              {messageContent}
            </Flexbox>
            <br />
          </td>
        </tr>
      );
    };
    return (
      <div>
        <TimelineFiltersContainer />
        <Table>
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
