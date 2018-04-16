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
          <Flexbox flexDirection="column" alignItems="flex-start">
            {messageValue.text}
            <Image
              className="timeline-image"
              src={messageValue.attachments[0].payload.url}
              responsive
            />
          </Flexbox>
        );
      } else {
        messageContent = messageValue.text;
      }
      const senderFullName = `${messageValue.senderFirstName} ${messageValue.senderLastName}`;
      const messageTimestamp = this.props.getLocalDateString(messageValue.timestamp);
      const messageCategory = this.props.getCategoryName(messageValue.category);
      const starIcon = messageValue.starred ? <div>&nbsp;• <Glyphicon glyph="star" /></div> : null;
      return (
        <tr key={messageKey}>
          <td>
            <Flexbox flexDirection="column">
              <Flexbox alignItems="center">
                <Image
                  className="timeline-card-profile-image"
                  src={messageValue.senderProfilePic}
                  circle
                />
                <span className="space-horizontal" />
                <Flexbox flexDirection="column" alignItems="flex-start">
                  <div>{senderFullName} • {messageTimestamp}</div>
                  <Flexbox>
                    <div>{messageCategory}</div>
                    {starIcon}
                  </Flexbox>
                </Flexbox>
              </Flexbox>
              <br />
              <Flexbox>
                {messageContent}
              </Flexbox>
            </Flexbox>
            <br />
          </td>
        </tr>
      );
    };
    return (
      <div>
        <TimelineFiltersContainer />
        <Table bordered condensed hover>
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
