import PropTypes from 'prop-types';
import React from 'react';


const TimelineStoryHeaderComponent = (props) => {
  const messageTimestamp = props.getDateString(props.messageValue.timestamp);
  return (
    <div className="timeline-story-padding timeline-story-padding-header">
      <h4>{messageTimestamp}</h4>
    </div>
  );
};

TimelineStoryHeaderComponent.propTypes = {
  getDateString: PropTypes.func.isRequired,
  messageValue: PropTypes.shape({
    category: PropTypes.string,
    senderFirstName: PropTypes.string,
    senderLastName: PropTypes.string,
    senderProfilePic: PropTypes.string,
    starred: PropTypes.bool,
    timestamp: PropTypes.number,
  }).isRequired,
};

export default TimelineStoryHeaderComponent;
