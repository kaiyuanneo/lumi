import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

import TimelineFiltersContainer from '../containers/TimelineFiltersContainer';
import TimelineStoryHeaderContainer from '../containers/TimelineStoryHeaderContainer';
import TimelineStoryContentComponent from '../components/TimelineStoryContentComponent';
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
      let timelineStory = (
        <Flexbox flexDirection="column" alignItems="flex-start">
          <TimelineStoryHeaderContainer messageValue={messageValue} />
          <TimelineStoryContentComponent messageValue={messageValue} />
        </Flexbox>
      );
      // Wrap timeline story with a centering Flexbox if screen width above threshold
      if (this.props.windowWidth > constants.WINDOW_WIDTH_MAX) {
        timelineStory = (
          <Flexbox flexDirection="column" alignItems="center">
            <div className="timeline-story-centred">
              {timelineStory}
            </div>
          </Flexbox>
        );
      }
      return (
        <tr key={messageKey}>
          <td className="timeline-story-table-data">
            {timelineStory}
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
  windowWidth: PropTypes.number.isRequired,
};

export default TimelineComponent;
