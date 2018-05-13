import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Image } from 'react-bootstrap';


const TimelineStoryHeaderComponent = (props) => {
  const senderFullName =
    `${props.messageValue.senderFirstName} ${props.messageValue.senderLastName}`;
  const messageTimestamp = props.getLocalDateString(props.messageValue.timestamp);
  return (
    <Flexbox alignItems="center" className="timeline-story-padding">
      <Image
        className="timeline-story-header-profile-image"
        src={props.messageValue.senderProfilePic}
        circle
      />
      <span className="space-horizontal" />
      <Flexbox flexDirection="column" alignItems="flex-start">
        <div>{senderFullName}</div>
        <div>{messageTimestamp}</div>
      </Flexbox>
    </Flexbox>
  );
};

TimelineStoryHeaderComponent.propTypes = {
  getLocalDateString: PropTypes.func.isRequired,
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
