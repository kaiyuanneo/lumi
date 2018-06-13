import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

import HelpMomentsComponent from '../components/HelpMomentsComponent';
import TimelineFiltersContainer from '../containers/TimelineFiltersContainer';
import TimelineStoryFooterContainer from '../containers/TimelineStoryFooterContainer';
import TimelineStoryHeaderContainer from '../containers/TimelineStoryHeaderContainer';
import TimelineStoryContentComponent from '../components/TimelineStoryContentComponent';
import * as constants from '../static/constants';


class TimelineComponent extends Component {
  componentDidMount() {
    this.props.syncMessages();
  }
  render() {
    // Do not render anything if messages have not finished being fetched from server
    if (
      this.props.numMessagesState === null ||
      (this.props.numMessagesState > 0 && this.props.numMessages === 0)
    ) {
      return null;
    }

    // If there are no messages, render the help component to prompt users to save moments
    if (this.props.numMessagesState === 0) {
      return (
        <Flexbox flexDirection="column" alignItems="center">
          <h4>{this.props.groupName} Group Timeline</h4>
          <HelpMomentsComponent />
        </Flexbox>
      );
    }

    // Define how to render individual moments
    const messageToTableRow = ([messageKey, messageValue]) => {
      if (!this.props.shouldRenderMessage(messageValue)) {
        return null;
      }
      let timelineStory = (
        <Flexbox flexDirection="column" alignItems="flex-start">
          <TimelineStoryHeaderContainer messageValue={messageValue} />
          <TimelineStoryContentComponent messageValue={messageValue} />
          <TimelineStoryFooterContainer messageValue={messageValue} />
        </Flexbox>
      );
      // Wrap timeline story with a centering Flexbox if screen width above threshold
      if (this.props.windowWidth > constants.WINDOW_WIDTH_MAX) {
        timelineStory = (
          <Flexbox flexDirection="column" alignItems="center">
            <div className="timeline-story-width">
              {timelineStory}
            </div>
          </Flexbox>
        );
      }
      return (
        <tr key={messageKey}>
          <td className="timeline-story-padding-table-data">
            {timelineStory}
            <br />
          </td>
        </tr>
      );
    };

    // Render Timeline filters and table of moments
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
  groupName: PropTypes.string,
  // numMessagesState will be null if the number of messages has not been fetched yet
  // Once the number of messages is fetched, numMessagesState's value is the number of messages
  numMessagesState: PropTypes.number,
  // numMessages is the size of the object of messages that have been synced from the server
  numMessages: PropTypes.number.isRequired,
  sortedMessages: PropTypes.instanceOf(Map).isRequired,
  syncMessages: PropTypes.func.isRequired,
  shouldRenderMessage: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

TimelineComponent.defaultProps = {
  groupName: null,
  numMessagesState: null,
};

export default TimelineComponent;
